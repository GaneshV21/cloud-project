import React, { useEffect, useState } from "react";
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
import { Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { getAvatarColor, getStatus } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import ProjectAccessDrawer from "./ProjectAccessDrawer";
import { addUser, setUserProjects } from "../../../redux/UsersSlice";
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
  // TODO: replace with the projects API
  const allProjects = ["Dev Project", "Staging Project", "Prod Project", "QA Project", "Analytics"];
  const userData = useSelector((state) => state.users.users);
  const [userCopyData, setUserCopyData] = useState([]);
  // Email of the user whose project access is being edited
  const [accessUser, setAccessUser] = useState(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  // TODO: hook up to the backend API
  const updateUserProjects = (email, projects) => {
    dispatch(setUserProjects({ email, projects }));
  };

  const actionItems = [
    { key: "projectAccess", label: "Project Access", icon: <SafetyCertificateOutlined /> },
    { key: "resetPassword", label: "Reset Password", icon: <KeyOutlined /> },
    { type: "divider" },
    { key: "deleteUser", label: "Delete User", icon: <DeleteOutlined />, danger: true },
  ];

  // TODO: hook these up to the backend APIs
  const onAction = (key, record) => {
    switch (key) {
      case "projectAccess":
        setAccessUser(record.email);
        break;
      case "resetPassword":
        break;
      case "deleteUser":
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
                key={project.name}
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

  // TODO: call the create user API with the password; only the user details go into the store
  const createUser = ({ password, ...user }) => {
    dispatch(addUser({ ...user, status: "Active" }));
    setCreateUserOpen(false);
  };

  useEffect(() => {
    setUserCopyData(
      userData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.projects.some((p) =>
            p.name.toLowerCase().includes(searchValue.toLowerCase())
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
          onClose={() => setAccessUser(null)}
          onSave={(projects) => {
            updateUserProjects(accessUser, projects);
            setAccessUser(null);
          }}
        />
      )}
    </>
  );
}

export default Users;
