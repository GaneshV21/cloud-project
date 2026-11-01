import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "../../../utils/custom-input";
import { getAvatarColor } from "../../../utils/common";
import apiClient from "../../../utils/api-client";
import { PROJECT_LIST } from "../../../utils/api-endpoints";
import { setCurrentProject } from "../../../redux/ProjectSlice";

const ProjectBadge = ({ name }) => (
  <div
    className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-white text-[10px] font-medium"
    style={{ backgroundColor: getAvatarColor(name) }}
  >
    {name?.[0]?.toUpperCase()}
  </div>
);

// Top-bar dropdown that picks the project every module works in
function ProjectSwitcher() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  // Latest selection, read after a fetch without re-creating fetchProjects
  const currentRef = useRef(currentProject);
  currentRef.current = currentProject;

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(PROJECT_LIST(userId));
      const list = res?.data?.data ?? [];
      setProjects(list);
      // Nothing selected, or the saved project no longer exists: fall back to the first one
      const current = currentRef.current;
      if (!list.some((p) => p.project_id === current?.project_id)) {
        dispatch(setCurrentProject(list[0] ?? null));
      }
    } catch {
      // The switcher just stays empty; pages show their own errors
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Selected somewhere else (e.g. a project card) but not in our list yet: refresh the list
  const currentId = currentProject?.project_id;
  const isFirstRender = useRef(true);
  useEffect(() => {
    // The initial fetch above already covers the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (currentId && !loading && !projects.some((p) => p.project_id === currentId)) {
      fetchProjects();
    }
    // Only react to a change of selection, not to every list update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Project</span>
      <CustomSelect
        className="w-[240px]"
        placeholder={loading ? "Loading projects..." : "No projects"}
        loading={loading}
        value={currentProject?.project_id}
        // Re-fetch on open so newly created or renamed projects show up
        onOpenChange={(open) => open && fetchProjects()}
        onChange={(projectId) =>
          dispatch(setCurrentProject(projects.find((p) => p.project_id === projectId)))
        }
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
