import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { toDetail } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { SECURITY_GROUP_LIST } from "../../../utils/api-endpoints";

// rules come back as an array from the backend
const formatRules = (rules) =>
  Array.isArray(rules)
    ? rules.map((r) => (typeof r === "object" ? JSON.stringify(r) : r)).join(", ")
    : rules ?? "";

function SecurityGroups() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [securityGroupDetail, setSecurityGroupDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
  const [securityGroupData, setSecurityGroupData] = useState([]);
  const [securityGroupCopyData, setSecurityGroupCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() =>
            setSecurityGroupDetail({ data: toDetail(record), state: true })
          }
        >
          {item}
        </p>
      ),
    },
    {
      title: "Rules",
      dataIndex: "rules",
      key: "rules",
      render: (item) => <p className="text-sm text-gray-900">{formatRules(item) || "-"}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: () => (
        <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
      ),
    },
  ];

  const onClose = () => {
    setSecurityGroupDetail({ data: {}, state: false });
  };

  const createSecurityGroup = (e) => {
    e.stopPropagation();
  };

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
    } catch (error) {
      setSecurityGroupData([]);
      message.error(getErrorMessage(error, "Couldn't load security groups."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchSecurityGroups();
  }, [fetchSecurityGroups]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setSecurityGroupCopyData(
      securityGroupData?.filter((item) =>
        [item.name, formatRules(item.rules), item.description].some((value) =>
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
        <CustomButton
          label="Create Security Group"
          icon={<PlusOutlined />}
          onClick={createSecurityGroup}
          disabled={!projectId}
        />
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
          rowKey="_id"
          bordered
        />
      </div>
      {securityGroupDetail?.state && (
        <Drawer
          item={securityGroupDetail?.data}
          title={"Security Group Detail"}
          open={securityGroupDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default SecurityGroups;
