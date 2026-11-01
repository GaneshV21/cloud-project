import  { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../../../utils/page-header";
import { CustomButton } from "../../../utils/custom-input";
import {
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { getAvatarColor } from "../../../utils/common";
import ProjectUsersModal from "./ProjectUsersModal";
import ProjectModal from "./ProjectModal";
import { renameProject } from "../../../redux/UsersSlice";

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
  const data = [
    {
      name: "Dev Project",
      description: "Demo Project",
      createdAt: "2025-07-18T11:20:00",
      status: "Active",
      compute: 2,
      network: 1,
      volume: 3,
    },
    {
      name: "Staging Project",
      description: "Demo Project 2",
      createdAt: "2025-07-20T09:45:00",
      status: "Inactive",
      compute: 0,
      network: 1,
      volume: 1,
    },
  ];
  const [projectData, setProjectData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [usersModal, setUsersModal] = useState(null);
  const [projectModal, setProjectModal] = useState(null);

  const createProject = (e) => {
    e.stopPropagation();
    setProjectModal({ mode: "create", project: null });
  };

  const saveProject = (project) => {
    if (projectModal.mode === "edit") {
      const original = projectModal.project;
      setProjectData((prev) => prev.map((p) => (p.name === original.name ? project : p)));
      if (original.name !== project.name) {
        dispatch(renameProject({ from: original.name, to: project.name }));
      }
    } else {
      setProjectData((prev) => [
        ...prev,
        {
          ...project,
          createdAt: new Date().toISOString(),
          status: "Active",
          compute: 0,
          network: 0,
          volume: 0,
        },
      ]);
    }
    setProjectModal(null);
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
    setProjectData(data);
    setSelectedProject(0);
  }, []);

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

      <div className="grid grid-cols-3 gap-5 mt-4">
        {projectData.map((item, index) => {
          const firstLetter = item.name?.[0]?.toUpperCase();
          return (
            <div
              key={item.name}
              onClick={() => setSelectedProject(index)}
              className={`bg-white border-solid border-[1px] rounded-xl p-4 flex flex-col gap-4 cursor-pointer transition-shadow hover:shadow-md ${
                selectedProject === index ? "border-[#5142D4]" : "border-[#D0D5DD]"
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
