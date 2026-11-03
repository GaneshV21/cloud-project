import { createSlice } from "@reduxjs/toolkit";
import { clearToken } from "./AuthSlice";
import apiClient from "../utils/api-client";
import { PROJECT_LIST, PROJECT_SELECT } from "../utils/api-endpoints";

// projects: the user's projects; currentProject: the one every service page works in ({ project_id, name })
// loaded: false until the list has come back once, so pages can wait instead of redirecting too early
const initialState = {
  projects: [],
  currentProject: null,
  loaded: false,
};

const pickProject = (project) =>
  project ? { project_id: project.project_id, name: project.name } : null;

export const ProjectSlice = createSlice({
  name: "ProjectSlice",
  initialState,
  reducers: {
    // payload: { projects, currentProjectId } from the project list API
    setProjectList: (state, action) => {
      const { projects, currentProjectId } = action.payload;
      state.projects = projects;
      state.currentProject = pickProject(projects.find((p) => p.project_id === currentProjectId));
      state.loaded = true;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = pickProject(action.payload);
    },
    // Created or edited project: keep the list (and the current project's name) in sync
    upsertProject: (state, action) => {
      const project = action.payload;
      const index = state.projects.findIndex((p) => p.project_id === project.project_id);
      if (index === -1) state.projects.push(project);
      else state.projects[index] = project;
      if (state.currentProject?.project_id === project.project_id) {
        state.currentProject = pickProject(project);
      }
    },
  },
  extraReducers: (builder) => {
    // Logging out forgets everything about projects
    builder.addCase(clearToken, () => initialState);
  },
});

export const { setProjectList, setCurrentProject, upsertProject } = ProjectSlice.actions;

// Loads the project list; the backend also says which project is current
export const loadProjects = (userId) => async (dispatch) => {
  if (!userId) return;
  const res = await apiClient.get(PROJECT_LIST(userId));
  dispatch(
    setProjectList({
      projects: res?.data?.data ?? [],
      currentProjectId: res?.data?.current_project_id || "",
    })
  );
};

// Saves the choice on the server (current_project_id), then switches to it here
export const selectProject = (userId, project) => async (dispatch) => {
  await apiClient.put(PROJECT_SELECT(userId, project.project_id));
  dispatch(setCurrentProject(project));
};

export default ProjectSlice.reducer;
