import { createSlice } from "@reduxjs/toolkit";

// Each user has a list of projects, with their role in each one.
// TODO: load users from the backend instead of this initial state
const initialState = {
  users: [
    {
      name: "Vasanth K",
      email: "vasanth@example.com",
      status: "Active",
      projects: [
        { name: "Dev Project", roleId: "member" },
        { name: "Staging Project", roleId: "member" },
        { name: "Prod Project", roleId: "create-role" },
        { name: "QA Project", roleId: "reader" },
      ],
    },
    {
      name: "Arun Kumar",
      email: "arun@example.com",
      status: "Active",
      projects: [
        { name: "Dev Project", roleId: "member" },
        { name: "QA Project", roleId: "member" },
      ],
    },
    {
      name: "Priya S",
      email: "priya@example.com",
      status: "Active",
      projects: [{ name: "Staging Project", roleId: "member" }],
    },
    {
      name: "Karthik R",
      email: "karthik@example.com",
      status: "Inactive",
      projects: [],
    },
    {
      name: "Divya M",
      email: "divya@example.com",
      status: "Active",
      projects: [
        { name: "Dev Project", roleId: "reader" },
        { name: "Analytics", roleId: "create-role" },
      ],
    },
  ],
};

export const UsersSlice = createSlice({
  name: "UsersSlice",
  initialState,
  reducers: {
    // payload: { name, email, status, projects } — never store the password here
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    // payload: { email, projects }
    setUserProjects: (state, action) => {
      const user = state.users.find((u) => u.email === action.payload.email);
      if (user) user.projects = action.payload.projects;
    },
    // payload: { project, emails, roleId }
    assignUsersToProject: (state, action) => {
      const { project, emails, roleId } = action.payload;
      state.users.forEach((user) => {
        if (emails.includes(user.email) && !user.projects.some((p) => p.name === project)) {
          user.projects.push({ name: project, roleId });
        }
      });
    },
    // payload: { project, emails }
    removeUsersFromProject: (state, action) => {
      const { project, emails } = action.payload;
      state.users.forEach((user) => {
        if (emails.includes(user.email)) {
          user.projects = user.projects.filter((p) => p.name !== project);
        }
      });
    },
    // payload: { from, to } — keeps memberships pointing at a renamed project
    renameProject: (state, action) => {
      const { from, to } = action.payload;
      state.users.forEach((user) => {
        user.projects.forEach((p) => {
          if (p.name === from) p.name = to;
        });
      });
    },
  },
});

export const {
  addUser,
  setUserProjects,
  assignUsersToProject,
  removeUsersFromProject,
  renameProject,
} = UsersSlice.actions;
export default UsersSlice.reducer;
