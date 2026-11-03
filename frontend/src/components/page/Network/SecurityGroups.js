import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, message, Modal, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import {
  SECURITY_GROUP_CREATE,
  SECURITY_GROUP_DELETE,
  SECURITY_GROUP_LIST,
  SECURITY_GROUP_UPDATE,
} from "../../../utils/api-endpoints";
import SecurityGroupModal from "./SecurityGroupModal";
import { securityGroupRulesPath } from "../../../utils/Path";

const pluralRules = (count) => `${count} rule${count === 1 ? "" : "s"}`;

function SecurityGroups() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
  // Max security groups in a project (sent by the list API)
  const [quota, setQuota] = useState(null);
  const [securityGroupData, setSecurityGroupData] = useState([]);
  const [securityGroupCopyData, setSecurityGroupCopyData] = useState([]);
  // { mode: "create" | "edit", securityGroup }
  const [groupModal, setGroupModal] = useState(null);
  const openRules = (group) => navigate(securityGroupRulesPath(group.securitygroup_id));
  const [modal, contextHolder] = Modal.useModal();

  // Security groups of the project selected in the top bar
  const fetchSecurityGroups = useCallback(async () => {
    if (!userId || !projectId) {
      setSecurityGroupData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(SECURITY_GROUP_LIST(userId, projectId));
      setSecurityGroupData(res?.data?.data ?? []);
      setQuota(res?.data?.quota ?? null);
    } catch (error) {
      setSecurityGroupData([]);
      message.error(getErrorMessage(error, "Couldn't load security groups."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  // Modal stays open (with the user's input) if the request fails
  const saveSecurityGroup = async (payload) => {
    try {
      if (groupModal.mode === "edit") {
        const id = groupModal.securityGroup.securitygroup_id;
        const res = await apiClient.put(SECURITY_GROUP_UPDATE(userId, projectId, id), payload);
        message.success(res?.data?.message || "Security group updated.");
      } else {
        const res = await apiClient.post(SECURITY_GROUP_CREATE(userId, projectId), payload);
        message.success(res?.data?.message || "Security group created.");
      }
      setGroupModal(null);
      fetchSecurityGroups();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't save the security group."));
    }
  };

  const deleteSecurityGroup = (group) => {
    // Rules must go first (the backend enforces this too)
    if (group.rules_count > 0) {
      modal.confirm({
        title: `"${group.name}" still has ${pluralRules(group.rules_count)}`,
        content: "Delete its rules first, then you can delete the security group.",
        okText: "Manage Rules",
        cancelText: "Close",
        onOk: () => openRules(group),
      });
      return;
    }
    modal.confirm({
      title: `Delete "${group.name}"?`,
      content: "This security group will be removed. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await apiClient.delete(
            SECURITY_GROUP_DELETE(userId, projectId, group.securitygroup_id)
          );
          message.success(res?.data?.message || "Security group deleted.");
          fetchSecurityGroups();
        } catch (error) {
          message.error(getErrorMessage(error, "Couldn't delete the security group."));
          // Rules may have been added elsewhere in the meantime
          fetchSecurityGroups();
        }
      },
    });
  };

  const actionItems = [
    { key: "rules", label: "Manage Rules", icon: <UnorderedListOutlined /> },
    { key: "edit", label: "Edit Security Group", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Delete Security Group", icon: <DeleteOutlined />, danger: true },
  ];

  const onAction = (key, record) => {
    switch (key) {
      case "rules":
        openRules(record);
        break;
      case "edit":
        setGroupModal({ mode: "edit", securityGroup: record });
        break;
      case "delete":
        deleteSecurityGroup(record);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() => openRules(record)}
        >
          {item}
        </p>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (item) => <p className="text-sm text-gray-500">{item || "-"}</p>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <Dropdown
          menu={{ items: actionItems, onClick: ({ key }) => onAction(key, record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
        </Dropdown>
      ),
    },
  ];

  const atQuota = quota !== null && securityGroupData.length >= quota;

  const openCreate = (e) => {
    e.stopPropagation();
    setGroupModal({ mode: "create", securityGroup: null });
  };

  useEffect(() => {
    fetchSecurityGroups();
  }, [fetchSecurityGroups]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setSecurityGroupCopyData(
      securityGroupData?.filter((item) =>
        [item.name, item.description].some((value) =>
          (value ?? "").toLowerCase().includes(search)
        )
      ),
    );
  }, [securityGroupData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {contextHolder}
      <PageHeader
        pathname={path}
        title="Security Groups"
        description={
          currentProject
            ? `Control inbound and outbound traffic rules for instances in ${currentProject.name}.`
            : "Select a project in the top bar to see its security groups."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <Tooltip title={atQuota ? `A project can have up to ${quota} security groups.` : ""}>
          <span>
            <CustomButton
              label="Create Security Group"
              icon={<PlusOutlined />}
              onClick={openCreate}
              disabled={!projectId || atQuota}
            />
          </span>
        </Tooltip>
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching security groups" : "No security groups"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Create a security group to control traffic."
          }
          columns={columns}
          dataSource={securityGroupCopyData}
          loading={loading}
          rowKey="securitygroup_id"
          bordered
        />
      </div>
      {groupModal && (
        <SecurityGroupModal
          open={!!groupModal}
          mode={groupModal.mode}
          securityGroup={groupModal.securityGroup}
          existingNames={securityGroupData
            .filter((g) => g.securitygroup_id !== groupModal.securityGroup?.securitygroup_id)
            .map((g) => g.name)}
          onClose={() => setGroupModal(null)}
          onSave={saveSecurityGroup}
        />
      )}
    </>
  );
}

export default SecurityGroups;
