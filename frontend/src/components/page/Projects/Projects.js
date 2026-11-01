import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../../../utils/page-header";
import { CustomButton } from "../../../utils/custom-input";
import {
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  MoreOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAvatarColor } from "../../../utils/common";
import ProjectUsersModal from "./ProjectUsersModal";
import ProjectModal from "./ProjectModal";
import { renameProject } from "../../../redux/UsersSlice";
import { setCurrentProject } from "../../../redux/ProjectSlice";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { PROJECT_CREATE, PROJECT_LIST, PROJECT_UPDATE } from "../../../utils/api-endpoints";

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
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const currentProject = useSelector((state) => state.project.currentProject);
  const [usersModal, setUsersModal] = useState(null);
  const [projectModal, setProjectModal] = useState(null);

  const createProject = (e) => {
    e.stopPropagation();
    setProjectModal({ mode: "create", project: null });
  };

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(PROJECT_LIST(userId));
      setProjectData(res?.data?.data ?? []);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't load projects."));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Modal stays open (with the user's input) if the request fails
  const saveProject = async ({ name, description }) => {
    const payload = { name, description };
    try {
      if (projectModal.mode === "edit") {
        const original = projectModal.project;
        const res = await apiClient.put(PROJECT_UPDATE(userId, original.project_id), payload);
        const updated = res?.data?.data ?? { ...original, ...payload };
        setProjectData((prev) => prev.map((p) => (p.project_id === original.project_id ? updated : p)));
        if (original.name !== updated.name) {
          dispatch(renameProject({ from: original.name, to: updated.name }));
          // Keep the top-bar switcher's label in sync
          if (currentProject?.project_id === updated.project_id) {
            dispatch(setCurrentProject(updated));
          }
        }
        message.success(res?.data?.message || "Project updated.");
      } else {
        const res = await apiClient.post(PROJECT_CREATE(userId), payload);
        const created = res?.data?.data;
        if (created) setProjectData((prev) => [...prev, created]);
        else await fetchProjects();
        message.success(res?.data?.message || "Project created.");
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
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
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

      <div className="grid grid-cols-3 gap-5 mt-4">
        {!loading && projectData.map((item) => {
          const firstLetter = item.name?.[0]?.toUpperCase();
          return (
            <div
              key={item.project_id}
              onClick={() => dispatch(setCurrentProject(item))}
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
