import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import {
  DeleteOutlined,
  KeyOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Dropdown, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { getAvatarColor, getStatus } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import ProjectAccessDrawer from "./ProjectAccessDrawer";
import { loadUsers, saveUserAccess, toProjectRoles } from "../../../redux/UsersSlice";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { SUBUSER_CREATE, SUBUSER_DELETE } from "../../../utils/api-endpoints";
import CreateUserModal from "./CreateUserModal";

function Users() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [userDetail, setUserDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);
  const getRoleName = (roleId) => roles.find((r) => r.id === roleId)?.name ?? "No role";
  const userId = useSelector((state) => state.auth.user?.user_id);
  // Real projects (loaded by the top-bar project switcher): [{ project_id, name }]
  const allProjects = useSelector((state) => state.project.projects);
  const userData = useSelector((state) => state.users.users);
  const [loading, setLoading] = useState(false);
  const [userCopyData, setUserCopyData] = useState([]);
  // Email of the user whose project access is being edited
  const [accessUser, setAccessUser] = useState(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [savingAccess, setSavingAccess] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  // Drawer stays open (with the changes) if the request fails
  const updateUserProjects = async (email, projects) => {
    const user = userData.find((u) => u.email === email);
    setSavingAccess(true);
    try {
      const res = await dispatch(saveUserAccess(userId, user.subuser_id, projects));
      message.success(res?.data?.message || "Access updated.");
      setAccessUser(null);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't update the user's access."));
    } finally {
      setSavingAccess(false);
    }
  };

  const deleteUser = (record) => {
    modal.confirm({
      title: `Delete "${record.name}"?`,
      content: "This user and their project access will be removed. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await apiClient.delete(SUBUSER_DELETE(userId, record.subuser_id));
          message.success(res?.data?.message || "User deleted.");
          await fetchUsers();
        } catch (error) {
          message.error(getErrorMessage(error, "Couldn't delete the user."));
        }
      },
    });
  };

  const actionItems = [
    { key: "projectAccess", label: "Project Access", icon: <SafetyCertificateOutlined /> },
    { key: "resetPassword", label: "Reset Password", icon: <KeyOutlined /> },
    { type: "divider" },
    { key: "deleteUser", label: "Delete User", icon: <DeleteOutlined />, danger: true },
  ];

  // TODO: hook reset password up to the backend API
  const onAction = (key, record) => {
    switch (key) {
      case "projectAccess":
        setAccessUser(record.email);
        break;
      case "resetPassword":
        break;
      case "deleteUser":
        deleteUser(record);
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
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-white text-[15px] font-medium"
            style={{ backgroundColor: getAvatarColor(item) }}
          >
            {item?.[0]?.toUpperCase()}
          </div>
          <p
            className="text-sm text-gray-900 underline cursor-pointer"
            onClick={() =>
              setUserDetail({
                data: {
                  ...record,
                  projects: record.projects
                    .map((p) => `${p.name} (${getRoleName(p.roleId)})`)
                    .join(", ") || "-",
                },
                state: true,
              })
            }
          >
            {item}
          </p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Project Access",
      dataIndex: "projects",
      key: "projects",
      render: (item, record) => {
        const visible = item.slice(0, 2);
        const extra = item.length - visible.length;
        return (
          <div
            className="flex flex-wrap items-center gap-1 cursor-pointer"
            onClick={() => setAccessUser(record.email)}
          >
            {!item.length && (
              <span className="text-[13px] text-[#5142D4] font-medium hover:underline">
                + Give access
              </span>
            )}
            {visible.map((project) => (
              <span
                key={project.project_id}
                className="flex items-center rounded-md overflow-hidden border-solid border-[1px] border-[#EAECF0] text-[12px]"
              >
                <span className="px-2 py-[1px] bg-white text-[#344054]">{project.name}</span>
                <span className="px-2 py-[1px] bg-[#EEF0FF] text-[#5142D4] font-medium">
                  {getRoleName(project.roleId)}
                </span>
              </span>
            ))}
            {extra > 0 && (
              <span className="px-2 py-[1px] rounded-md text-[12px] bg-[#F2F4F7] text-[#344054]">
                +{extra} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (item) => {
        return <p>{getStatus(item)}</p>;
      },
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

  const onClose = () => {
    setUserDetail({ data: {}, state: false });
  };

  const openCreateUser = (e) => {
    e.stopPropagation();
    setCreateUserOpen(true);
  };

  // Sub-users created by the logged-in user
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(loadUsers(userId));
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't load users."));
    } finally {
      setLoading(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Modal stays open (with the user's input) if the request fails
  const createUser = async ({ name, email, password, projects }) => {
    try {
      const res = await apiClient.post(SUBUSER_CREATE(userId), {
        name,
        email,
        password,
        projects: toProjectRoles(projects, roles),
      });
      message.success(res?.data?.message || "User created.");
      setCreateUserOpen(false);
      await fetchUsers();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't create the user."));
    }
  };

  useEffect(() => {
    setUserCopyData(
      userData?.filter((item) => {
        return (
          (item.name ?? "").toLowerCase().includes(searchValue.toLowerCase()) ||
          (item.email ?? "").toLowerCase().includes(searchValue.toLowerCase()) ||
          item.projects.some((p) =>
            (p.name ?? "").toLowerCase().includes(searchValue.toLowerCase())
          )
        );
      }),
    );
  }, [userData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {contextHolder}
      <PageHeader
        pathname={path}
        title="Users"
        description="Manage users and their access to projects."
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Add User"
          icon={<PlusOutlined />}
          onClick={openCreateUser}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching users" : "No users"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Add a user to give them access to your projects."
          }
          columns={columns}
          dataSource={userCopyData}
          loading={loading}
          rowKey="subuser_id"
          bordered
        />
      </div>
      {userDetail?.state && (
        <Drawer
          item={userDetail?.data}
          title={"User Detail"}
          open={userDetail?.state}
          onClose={onClose}
        />
      )}
      {createUserOpen && (
        <CreateUserModal
          open={createUserOpen}
          allProjects={allProjects}
          existingEmails={userData.map((u) => u.email)}
          onClose={() => setCreateUserOpen(false)}
          onSave={createUser}
        />
      )}
      {accessUser && (
        <ProjectAccessDrawer
          open={!!accessUser}
          user={userData.find((u) => u.email === accessUser)}
          allProjects={allProjects}
          saving={savingAccess}
          onClose={() => setAccessUser(null)}
          onSave={(projects) => updateUserProjects(accessUser, projects)}
        />
      )}
    </>
  );
}

export default Users;
