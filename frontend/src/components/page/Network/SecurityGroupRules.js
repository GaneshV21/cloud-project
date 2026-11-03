import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dropdown, message, Modal, Tooltip } from "antd";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import PageHeader from "../../../utils/page-header";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import {
  RULE_CREATE,
  RULE_DELETE,
  RULE_LIST,
  RULE_PROTOCOLS,
  RULE_TYPES,
  RULE_UPDATE,
  SECURITY_GROUP_GET,
} from "../../../utils/api-endpoints";
import PATH from "../../../utils/Path";
import RuleModal from "./RuleModal";

// "Security Groups" links back to the table; the other crumbs are plain text
const BREADCRUMB = [
  { title: "Network" },
  { title: "Security Groups", path: PATH.SecurityGroups },
  { title: "Manage Rules" },
];

const TypeBadge = ({ type, label }) => (
  <span
    className={`px-2 py-[2px] rounded-full text-[12px] font-medium ${
      type === "egress" ? "bg-[#FEF6EE] text-[#B93815]" : "bg-[#EEF0FF] text-[#5142D4]"
    }`}
  >
    {label ?? type}
  </span>
);

function SecurityGroupRules() {
  const navigate = useNavigate();
  const { securitygroup_id: securityGroupId } = useParams();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const projectId = useSelector((state) => state.project.currentProject?.project_id);
  const [securityGroup, setSecurityGroup] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [rules, setRules] = useState([]);
  const [rulesCopy, setRulesCopy] = useState([]);
  const [types, setTypes] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(false);
  // Max rules in one security group (sent by the rule list API)
  const [quota, setQuota] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  // { mode: "create" | "edit", rule }
  const [ruleModal, setRuleModal] = useState(null);
  const [modal, contextHolder] = Modal.useModal();

  const labelOf = (list, value) => list.find((o) => o.value === value)?.label ?? value;
  const atQuota = quota !== null && rules.length >= quota;
  const backToGroups = () => navigate(PATH.SecurityGroups);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(RULE_LIST(userId, projectId, securityGroupId));
      setRules(res?.data?.data ?? []);
      setQuota(res?.data?.quota ?? null);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't load rules."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId, securityGroupId]);

  // Security group (for its name) + rule options + rules
  useEffect(() => {
    if (!userId || !projectId || !securityGroupId) return;
    setNotFound(false);
    apiClient
      .get(SECURITY_GROUP_GET(userId, projectId, securityGroupId))
      .then((res) => setSecurityGroup(res?.data?.data ?? null))
      .catch((error) => {
        if (error?.response?.status === 404) setNotFound(true);
        else message.error(getErrorMessage(error, "Couldn't load the security group."));
      });
    Promise.all([apiClient.get(RULE_TYPES(userId)), apiClient.get(RULE_PROTOCOLS(userId))])
      .then(([typeRes, protocolRes]) => {
        setTypes(typeRes?.data?.data ?? []);
        setProtocols(protocolRes?.data?.data ?? []);
      })
      .catch((error) => message.error(getErrorMessage(error, "Couldn't load rule options.")));
    fetchRules();
  }, [userId, projectId, securityGroupId, fetchRules]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setRulesCopy(
      rules.filter((rule) =>
        [labelOf(types, rule.type), labelOf(protocols, rule.protocol), rule.port, rule.cidr].some(
          (value) => (value ?? "").toLowerCase().includes(search)
        )
      )
    );
    // labelOf only reads types / protocols, which are listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, searchValue, types, protocols]);

  // Modal stays open (with the user's input) if the request fails
  const saveRule = async (payload) => {
    try {
      if (ruleModal.mode === "edit") {
        const res = await apiClient.put(
          RULE_UPDATE(userId, projectId, securityGroupId, ruleModal.rule.security_group_rule_id),
          payload
        );
        message.success(res?.data?.message || "Rule updated.");
      } else {
        const res = await apiClient.post(RULE_CREATE(userId, projectId, securityGroupId), payload);
        message.success(res?.data?.message || "Rule added.");
      }
      setRuleModal(null);
      fetchRules();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't save the rule."));
    }
  };

  const confirmDelete = (rule) => {
    modal.confirm({
      title: "Delete this rule?",
      content: `${labelOf(types, rule.type)} · ${labelOf(protocols, rule.protocol)}${
        rule.port ? ` · port ${rule.port}` : ""
      } · ${rule.cidr}`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await apiClient.delete(
            RULE_DELETE(userId, projectId, securityGroupId, rule.security_group_rule_id)
          );
          message.success(res?.data?.message || "Rule deleted.");
          fetchRules();
        } catch (error) {
          message.error(getErrorMessage(error, "Couldn't delete the rule."));
        }
      },
    });
  };

  const actionItems = [
    { key: "edit", label: "Edit Rule", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Delete Rule", icon: <DeleteOutlined />, danger: true },
  ];

  const onAction = (key, record) => {
    switch (key) {
      case "edit":
        setRuleModal({ mode: "edit", rule: record });
        break;
      case "delete":
        confirmDelete(record);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (item) => <TypeBadge type={item} label={labelOf(types, item)} />,
    },
    {
      title: "Protocol",
      dataIndex: "protocol",
      key: "protocol",
      render: (item) => <p className="text-sm text-gray-900">{labelOf(protocols, item)}</p>,
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      render: (item) => <p className="text-sm text-gray-900">{item || "-"}</p>,
    },
    {
      title: "CIDR",
      dataIndex: "cidr",
      key: "cidr",
      render: (item) => <p className="text-sm text-gray-900 font-mono">{item}</p>,
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

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 mt-8 rounded-xl border-dashed border-[1px] border-[#D0D5DD]">
        <div className="h-16 w-16 rounded-2xl bg-[#EEF0FF] flex items-center justify-center">
          <SafetyOutlined className="text-[30px] text-[#5142D4]" />
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#101828]">Security group not found</p>
          <p className="text-sm text-[#667085]">
            It may have been deleted, or it belongs to a different project.
          </p>
        </div>
        <CustomButton label="Back to Security Groups" onClick={backToGroups} />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <PageHeader
        breadcrumbItems={BREADCRUMB}
        title={securityGroup ? `Rules · ${securityGroup.name}` : "Manage Rules"}
        description={
          securityGroup?.description ||
          "Ingress and egress traffic rules for this security group."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <Tooltip title={atQuota ? `A security group can have up to ${quota} rules.` : ""}>
          <span>
            <CustomButton
              label="Add Rule"
              icon={<PlusOutlined />}
              disabled={!types.length || !protocols.length || atQuota}
              onClick={() => setRuleModal({ mode: "create", rule: null })}
            />
          </span>
        </Tooltip>
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching rules" : "No rules"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Add a rule to allow traffic for this security group."
          }
          columns={columns}
          dataSource={rulesCopy}
          loading={loading}
          rowKey="security_group_rule_id"
          bordered
        />
      </div>
      {ruleModal && (
        <RuleModal
          open={!!ruleModal}
          mode={ruleModal.mode}
          rule={ruleModal.rule}
          securityGroupName={securityGroup?.name}
          types={types}
          protocols={protocols}
          onClose={() => setRuleModal(null)}
          onSave={saveRule}
        />
      )}
    </>
  );
}

export default SecurityGroupRules;
