import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../../../utils/bread-crumbs";
import { CustomButton } from "../../../utils/custom-input";
import {
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";

// Avatar colors taken from the app's theme palette
const avatarColors = [
  "#5142D4",
  "#4338CA",
  "#6366F1",
  "#4F46E5",
  "#7C3AED",
  "#818CF8",
  "#312E81",
  "#F04438",
];

// Same project name always gets the same color, so it doesn't flicker on re-render
const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

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

  const createProject = (e) => {
    e.stopPropagation();
  };

  const menuItems = [
    { key: "view", label: "View" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: <span className="text-[#F04438]">Delete</span> },
  ];

  useEffect(() => {
    setProjectData(data);
    setSelectedProject(0);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <BreadCrumb pathname={path} />
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <p className="text-[24px] leading-[38px] font-semibold text-[#181D27]">My Projects</p>
          <p className="text-[#535862] text-[16px] leading-6">
            Manage your projects and access resources, members and settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            label="Create Project"
            icon={<PlusOutlined />}
            onClick={createProject}
          />
        </div>
      </div>

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
                <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomLeft">
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
    </>
  );
}

export default Projects;
