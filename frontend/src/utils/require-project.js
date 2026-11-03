import React from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PATH from "./Path";

// Service pages (Instances, Networks, Volumes...) need a selected project.
// Without one, send the user to Projects and remember where they were going.
function RequireProject() {
  const location = useLocation();
  const { currentProject, loaded } = useSelector((state) => state.project);

  if (!loaded) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (!currentProject) {
    return <Navigate to={PATH.Projects} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default RequireProject;
