import { createSlice } from "@reduxjs/toolkit";
import { clearToken } from "./AuthSlice";
import apiClient from "../utils/api-client";
import { PROJECT_MANAGE_USER, SUBUSER_LIST } from "../utils/api-endpoints";

// users: sub-users from the backend (subuser_id, name, email, status, ...).
// Each user's project_roles is also kept as projects ([{ project_id, name, roleId }]) for the UI.
const initialState = {
  users: [],
  loaded: false,
};

const withProjects = (user) => ({
  ...user,
  projects: (user.project_roles ?? []).map((r) => ({
    project_id: r.project_id,
    name: r.project_name,
    roleId: r.role,
  })),
});

export const UsersSlice = createSlice({
  name: "UsersSlice",
  initialState,
  reducers: {
    // payload: sub-users from the list API
    setUsers: (state, action) => {
      state.users = action.payload.map(withProjects);
      state.loaded = true;
    },
    // payload: one sub-user from the API (e.g. after manage-user)
    upsertUser: (state, action) => {
      const user = withProjects(action.payload);
      const index = state.users.findIndex((u) => u.subuser_id === user.subuser_id);
      if (index === -1) state.users.push(user);
      else state.users[index] = user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearToken, () => initialState);
  },
});

export const { setUsers, upsertUser } = UsersSlice.actions;

// [{ project_id, roleId }] -> what the API stores: [{ project_id, role, permissions }]
export const toProjectRoles = (projects, roles) =>
  projects.map(({ project_id, roleId }) => ({
    project_id,
    role: roleId,
    permissions: roles.find((r) => r.id === roleId)?.permissions ?? [],
  }));

// Sub-users created by this user
export const loadUsers = (userId) => async (dispatch) => {
  if (!userId) return;
  const res = await apiClient.get(SUBUSER_LIST(userId));
  dispatch(setUsers(res?.data?.data ?? []));
};

// Replaces a sub-user's project access. projects: [{ project_id, roleId }]
export const saveUserAccess = (userId, subuserId, projects) => async (dispatch, getState) => {
  const res = await apiClient.put(PROJECT_MANAGE_USER(userId, subuserId), {
    projects: toProjectRoles(projects, getState().roles.roles),
  });
  if (res?.data?.data) dispatch(upsertUser(res.data.data));
  return res;
};

export default UsersSlice.reducer;
