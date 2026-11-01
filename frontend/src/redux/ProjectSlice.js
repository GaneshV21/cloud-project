import { createSlice } from "@reduxjs/toolkit";
import { clearToken } from "./AuthSlice";

const STORAGE_KEY = "currentProject";

const loadCurrentProject = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

// The project every module (Instances, Networks, Volumes...) works in: { project_id, name }
const initialState = {
  currentProject: loadCurrentProject(),
};

export const ProjectSlice = createSlice({
  name: "ProjectSlice",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      const project = action.payload
        ? { project_id: action.payload.project_id, name: action.payload.name }
        : null;
      state.currentProject = project;
      if (project) localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      else localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    // Logging out forgets the selected project
    builder.addCase(clearToken, (state) => {
      state.currentProject = null;
    });
  },
});

export const { setCurrentProject } = ProjectSlice.actions;
export default ProjectSlice.reducer;
