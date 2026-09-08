import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../../../utils/bread-crumbs";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import Item from "antd/es/list/Item";

function Projects() {
  const [path, setPath] = useState("");
  const location = useLocation();
  const data = [
    {
      name: "Project 1",
      description: "Demo Project",
    },
    {
      name: "Project 2",
      description: "Demo Project 2",
    },
  ];
  const [projectData, setProjectData] = useState([]);

  const createProject = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setProjectData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">Projects</h1>

          <BreadCrumb pathname={path} />
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            label="Create Project"
            icon={<PlusOutlined />}
            onClick={createProject}
          />
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-5">
          {projectData.map((item) => {
            return (
              <>
                <div className="border-solid border-[1px] border-gray-300 rounded-lg h-[150px]">
                  <Card>
                    <div className="flex flex-col gap-2">
                      <p className="text-xl">Name : {item?.name}</p>
                      <p className = "text-lg"> Description : {item.description ?? "No Description"}</p>
                      <p>Manage Users: {item?.users ?? "0" }</p>
                    </div>
                  </Card>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Projects;
