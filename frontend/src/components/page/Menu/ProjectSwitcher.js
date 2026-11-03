import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "../../../utils/custom-input";
import { getAvatarColor } from "../../../utils/common";
import { getErrorMessage } from "../../../utils/api-client";
import { loadProjects, selectProject } from "../../../redux/ProjectSlice";
import PATH from "../../../utils/Path";

const ProjectBadge = ({ name }) => (
  <div
    className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-white text-[10px] font-medium"
    style={{ backgroundColor: getAvatarColor(name) }}
  >
    {name?.[0]?.toUpperCase()}
  </div>
);

// Top-bar dropdown that picks the project every service page works in
function ProjectSwitcher() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const { projects, currentProject, loaded } = useSelector((state) => state.project);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(loadProjects(userId));
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't load projects."));
    } finally {
      setLoading(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleChange = async (projectId) => {
    const project = projects.find((p) => p.project_id === projectId);
    if (!project || projectId === currentProject?.project_id) return;
    try {
      await dispatch(selectProject(userId, project));
      // Full reload on the dashboard so every page starts fresh for the new project
      window.location.assign(PATH.Dashboard);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't switch project."));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Project</span>
      <CustomSelect
        className="w-[240px]"
        placeholder={
          !loaded ? "Loading projects..." : projects.length ? "Select a project" : "No projects"
        }
        loading={loading}
        value={currentProject?.project_id}
        // Re-fetch on open so newly created or renamed projects show up
        onOpenChange={(open) => open && refresh()}
        onChange={handleChange}
        options={projects.map((project) => ({
          value: project.project_id,
          label: (
            <div className="flex items-center gap-2">
              <ProjectBadge name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          ),
        }))}
      />
    </div>
  );
}

export default ProjectSwitcher;
