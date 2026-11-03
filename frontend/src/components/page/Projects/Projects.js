import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../utils/page-header";
import { CustomButton } from "../../../utils/custom-input";
import {
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, message, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAvatarColor } from "../../../utils/common";
import ProjectUsersModal from "./ProjectUsersModal";
import ProjectModal from "./ProjectModal";
import { loadUsers } from "../../../redux/UsersSlice";
import { loadProjects, selectProject, upsertProject } from "../../../redux/ProjectSlice";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import {
  PROJECT_CREATE,
  PROJECT_DELETE,
  PROJECT_SUMMARY,
  PROJECT_UPDATE,
} from "../../../utils/api-endpoints";

// Resources that must be removed before a project can be deleted (keys from the summary API)
const RESOURCES = [
  { key: "instances", label: "Instances" },
  { key: "keypairs", label: "Keypairs" },
  { key: "networks", label: "Networks" },
  { key: "security_groups", label: "Security groups" },
  { key: "security_group_rules", label: "Security group rules" },
  { key: "volumes", label: "Volumes" },
];

const formatDate = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

function Projects() {
  const [path, setPath] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const {
    projects: projectData,
    currentProject,
    loaded,
  } = useSelector((state) => state.project);
  const [loading, setLoading] = useState(!loaded);
  const [usersModal, setUsersModal] = useState(null);
  const [projectModal, setProjectModal] = useState(null);
  const usersLoaded = useSelector((state) => state.users.loaded);
  const [modal, contextHolder] = Modal.useModal();
  // Service page the user was sent here from (by RequireProject), e.g. "/compute/instances"
  const redirectTo = location.state?.from;

  const createProject = (e) => {
    e.stopPropagation();
    setProjectModal({ mode: "create", project: null });
  };

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await dispatch(loadProjects(userId));
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't load projects."));
    } finally {
      setLoading(false);
    }
  }, [dispatch, userId]);

  // The backend updates users' project_roles on rename/delete: refresh them if already loaded
  const refreshUsers = () => {
    if (usersLoaded) dispatch(loadUsers(userId)).catch(() => {});
  };

  const chooseProject = async (project) => {
    if (project.project_id === currentProject?.project_id) return;
    try {
      await dispatch(selectProject(userId, project));
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't select the project."));
    }
  };

  // Once a project is selected (here or in the top bar), continue to the page the user wanted
  useEffect(() => {
    if (currentProject && redirectTo) navigate(redirectTo, { replace: true });
  }, [currentProject, redirectTo, navigate]);

  // Modal stays open (with the user's input) if the request fails
  const saveProject = async ({ name, description }) => {
    const payload = { name, description };
    try {
      if (projectModal.mode === "edit") {
        const original = projectModal.project;
        const res = await apiClient.put(PROJECT_UPDATE(userId, original.project_id), payload);
        const updated = res?.data?.data ?? { ...original, ...payload };
        // Also renames it in the top-bar switcher if it's the current project
        dispatch(upsertProject(updated));
        if (original.name !== updated.name) refreshUsers();
        message.success(res?.data?.message || "Project updated.");
      } else {
        const res = await apiClient.post(PROJECT_CREATE(userId), payload);
        message.success(res?.data?.message || "Project created.");
        // Reload: if this is the only project, the backend makes it the current one
        await fetchProjects();
      }
      setProjectModal(null);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't save the project."));
    }
  };

  const menuItems = [
    { key: "assignUser", label: "Assign User", icon: <UserAddOutlined /> },
    { key: "removeUser", label: "Remove User", icon: <UserDeleteOutlined /> },
    { type: "divider" },
    { key: "edit", label: "Edit", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true },
  ];

  const onAction = (key, record) => {
    switch (key) {
      case "assignUser":
        setUsersModal({ mode: "assign", project: record });
        break;
      case "removeUser":
        setUsersModal({ mode: "remove", project: record });
        break;
      case "edit":
        setProjectModal({ mode: "edit", project: record });
        break;
      case "delete":
        deleteProject(record);
        break;
      default:
        break;
    }
  };

  // Only an empty project can be deleted: check what's inside first
  const deleteProject = async (project) => {
    let counts;
    try {
      const res = await apiClient.get(PROJECT_SUMMARY(userId, project.project_id));
      counts = res?.data?.data?.counts ?? {};
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't check the project's resources."));
      return;
    }

    const remaining = RESOURCES.filter((r) => counts[r.key] > 0);
    if (remaining.length) {
      modal.warning({
        title: `"${project.name}" can't be deleted yet`,
        content: (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#535862]">
              Delete these resources first, then try again:
            </p>
            <ul className="flex flex-col gap-1">
              {remaining.map((r) => (
                <li key={r.key} className="flex justify-between text-sm text-[#344054]">
                  <span>{r.label}</span>
                  <span className="font-semibold">{counts[r.key]}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
        okText: "OK",
      });
      return;
    }

    modal.confirm({
      title: `Delete "${project.name}"?`,
      content: "This project is empty and will be removed. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await apiClient.delete(PROJECT_DELETE(userId, project.project_id));
          message.success(res?.data?.message || "Project deleted.");
          // Users lose their access to it
          refreshUsers();
          // Reload: if it was the current project the backend cleared it
          await fetchProjects();
        } catch (error) {
          message.error(getErrorMessage(error, "Couldn't delete the project."));
        }
      },
    });
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {contextHolder}
      <PageHeader
        pathname={path}
        title="My Projects"
        description="Manage your projects and access resources, members and settings."
      >
        <CustomButton
          label="Create Project"
          icon={<PlusOutlined />}
          onClick={createProject}
        />
      </PageHeader>

      {loading && (
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      )}

      {!loading && !projectData.length && (
        <div className="flex flex-col items-center gap-3 py-16 mt-4 rounded-xl border-dashed border-[1px] border-[#D0D5DD]">
          <div className="h-16 w-16 rounded-2xl bg-[#EEF0FF] flex items-center justify-center">
            <FolderOpenOutlined className="text-[30px] text-[#5142D4]" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#101828]">No projects yet</p>
            <p className="text-sm text-[#667085]">
              Use Create Project above to add your first project.
            </p>
          </div>
        </div>
      )}

      {!loading && projectData.length > 0 && !currentProject && (
        <div className="flex items-start gap-3 mt-4 p-4 rounded-xl border-solid border-[1px] border-[#5142D4] bg-[#F8F7FF]">
          <InfoCircleOutlined className="text-[18px] text-[#5142D4] mt-[2px]" />
          <div>
            <p className="text-sm font-semibold text-[#101828]">
              Select a project to manage your services
            </p>
            <p className="text-sm text-[#535862]">
              Instances, networks, volumes and keypairs live inside a project. Click a project
              below, or create a new one, to continue
              {redirectTo ? " to the page you were opening." : "."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 mt-4">
        {!loading && projectData.map((item) => {
          const firstLetter = item.name?.[0]?.toUpperCase();
          return (
            <div
              key={item.project_id}
              onClick={() => chooseProject(item)}
              className={`bg-white border-solid border-[1px] rounded-xl p-4 flex flex-col gap-4 cursor-pointer transition-shadow hover:shadow-md ${
                currentProject?.project_id === item.project_id
                  ? "border-[#5142D4]"
                  : "border-[#D0D5DD]"
              }`}
            >
              {/* Header: avatar, name, owner, created, menu */}
              <div className="flex gap-3 items-start">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center text-white text-[18px] font-medium"
                  style={{ backgroundColor: getAvatarColor(item.name) }}
                >
                  {firstLetter}
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <p className="text-[18px] leading-7 font-semibold text-[#101828] truncate">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-[#667085] truncate">Description: {item.description}</p>
                  <p className="text-[13px] text-[#667085]">
                    Created: {formatDate(item.createdAt)}
                  </p>
                </div>
                <Dropdown
                  menu={{
                    items: menuItems,
                    onClick: ({ key, domEvent }) => {
                      domEvent.stopPropagation();
                      onAction(key, item);
                    },
                  }}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <MoreOutlined
                    className="text-[18px] text-[#344054] p-1 rounded hover:bg-[#F2F4F7]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>


              {/* Resource totals */}
              <div className="flex items-center gap-5 text-[13px] text-[#667085]">
                <span className="flex items-center gap-1">
                  <CloudServerOutlined className="text-[#5142D4]" />
                  <span className="font-semibold text-[#344054]">{item.compute ?? 0}</span> Compute
                </span>
                <span className="flex items-center gap-1">
                  <ClusterOutlined className="text-[#5142D4]" />
                  <span className="font-semibold text-[#344054]">{item.network ?? 0}</span> Network
                </span>
                <span className="flex items-center gap-1">
                  <DatabaseOutlined className="text-[#5142D4]" />
                  <span className="font-semibold text-[#344054]">{item.volume ?? 0}</span> Volume
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {projectModal && (
        <ProjectModal
          open={!!projectModal}
          mode={projectModal.mode}
          project={projectModal.project}
          existingNames={projectData
            .filter((p) => p.name !== projectModal.project?.name)
            .map((p) => p.name)}
          onClose={() => setProjectModal(null)}
          onSave={saveProject}
        />
      )}
      {usersModal && (
        <ProjectUsersModal
          open={!!usersModal}
          mode={usersModal.mode}
          project={usersModal.project}
          onClose={() => setUsersModal(null)}
        />
      )}
    </>
  );
}

export default Projects;
