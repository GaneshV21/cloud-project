import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import PageHeader from "../../../utils/page-header";
import { getAvatarColor } from "../../../utils/common";
import {
  getPermissionKey,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  TOTAL_PERMISSIONS,
} from "../../../utils/permissions";
import { addRole, deleteRole, updateRole } from "../../../redux/RolesSlice";
import RoleModal from "./RoleModal";

export const RoleTypeBadge = ({ system }) =>
  system ? (
    <span className="flex items-center gap-1 w-fit px-2 py-[1px] rounded-full text-[11px] font-medium bg-[#F2F4F7] text-[#344054]">
      <LockOutlined className="text-[10px]" /> Built-in
    </span>
  ) : (
    <span className="w-fit px-2 py-[1px] rounded-full text-[11px] font-medium bg-[#EEF0FF] text-[#5142D4]">
      Custom
    </span>
  );

// One chip per module the role can access, with R C U D letters lit up for granted actions
const ModuleAccessChips = ({ permissions }) => {
  const modules = PERMISSION_MODULES.filter((m) =>
    PERMISSION_ACTIONS.some((a) => permissions.includes(getPermissionKey(m.key, a.key)))
  );
  if (!modules.length) return <span className="text-[13px] text-[#98A2B3]">No access</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {modules.map((module) => (
        <span
          key={module.key}
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg border-solid border-[1px] border-[#EAECF0] bg-white"
        >
          <span className="text-[12px] font-medium text-[#344054]">{module.label}</span>
          <span className="flex gap-[2px]">
            {PERMISSION_ACTIONS.map((action) => {
              const granted = permissions.includes(getPermissionKey(module.key, action.key));
              return (
                <span
                  key={action.key}
                  title={`${action.label}${granted ? "" : " (not allowed)"}`}
                  className={`h-5 w-5 rounded flex items-center justify-center text-[10px] font-semibold ${
                    granted ? "bg-[#5142D4] text-white" : "bg-[#F2F4F7] text-[#D0D5DD]"
                  }`}
                >
                  {action.short}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </div>
  );
};

function Roles() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);
  const [roleCopyData, setRoleCopyData] = useState([]);
  // { mode: "create" | "edit" | "view", role }
  const [roleModal, setRoleModal] = useState(null);
  const [modal, contextHolder] = Modal.useModal();

  const createRole = (e) => {
    e?.stopPropagation();
    setRoleModal({ mode: "create", role: null });
  };

  const confirmDelete = (role) => {
    modal.confirm({
      title: `Delete "${role.name}"?`,
      content: "Users assigned this role will lose these permissions. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      // TODO: call the delete role API
      onOk: () => dispatch(deleteRole(role.id)),
    });
  };

  // TODO: call the create / update role APIs
  const saveRole = (role) => {
    if (roleModal.mode === "edit") {
      dispatch(updateRole(role));
    } else {
      dispatch(
        addRole({
          ...role,
          id: `${role.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          system: false,
          createdAt: new Date().toISOString(),
        })
      );
    }
    setRoleModal(null);
  };

  const getActionItems = (role) =>
    role.system
      ? [{ key: "view", label: "View Permissions", icon: <EyeOutlined /> }]
      : [
          { key: "edit", label: "Edit", icon: <EditOutlined /> },
          { type: "divider" },
          { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
        ];

  const onAction = (key, role) => {
    switch (key) {
      case "view":
        setRoleModal({ mode: "view", role });
        break;
      case "edit":
        setRoleModal({ mode: "edit", role });
        break;
      case "delete":
        confirmDelete(role);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "name",
      key: "name",
      width: "32%",
      render: (item, record) => (
        <div className="flex items-start gap-3">
          <div
            className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-white text-[15px] font-medium"
            style={{ backgroundColor: record.system ? "#344054" : getAvatarColor(item) }}
          >
            {record.system ? <LockOutlined /> : item?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-semibold text-[#101828] cursor-pointer hover:text-[#5142D4]"
                onClick={() =>
                  setRoleModal({ mode: record.system ? "view" : "edit", role: record })
                }
              >
                {item}
              </p>
              <RoleTypeBadge system={record.system} />
            </div>
            <p className="text-[13px] text-[#667085]">{record.description || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Module Access",
      dataIndex: "permissions",
      key: "permissions",
      render: (item) => <ModuleAccessChips permissions={item} />,
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "count",
      width: 130,
      render: (item) => (
        <div className="flex flex-col gap-1">
          <p className="text-[13px] text-[#344054]">
            <span className="font-semibold">{item.length}</span> / {TOTAL_PERMISSIONS}
          </p>
          <div className="h-[6px] w-full rounded-full bg-[#F2F4F7] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5142D4]"
              style={{ width: `${(item.length / TOTAL_PERMISSIONS) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record), onClick: ({ key }) => onAction(key, record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    setRoleCopyData(
      roles?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchValue.toLowerCase())
        );
      })
    );
  }, [roles, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {contextHolder}
      <PageHeader
        pathname={path}
        title="Roles"
        description="Create roles from a set of allowed actions and assign them to users in each project."
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton label="Create Role" icon={<PlusOutlined />} onClick={createRole} />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          columns={columns}
          dataSource={roleCopyData.map((role) => ({ ...role, key: role.id }))}
          bordered
        />
      </div>
      {roleModal && (
        <RoleModal
          open={!!roleModal}
          mode={roleModal.mode}
          role={roleModal.role}
          existingNames={roles
            .filter((r) => r.id !== roleModal.role?.id)
            .map((r) => r.name)}
          onClose={() => setRoleModal(null)}
          onSave={saveRole}
        />
      )}
    </>
  );
}

export default Roles;
