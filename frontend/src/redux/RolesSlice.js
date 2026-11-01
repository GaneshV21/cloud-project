import { createSlice } from "@reduxjs/toolkit";
import { ALL_PERMISSIONS } from "../utils/permissions";

// Reader and Member are built-in (system) roles and can't be edited or deleted.
// TODO: load roles from the backend instead of this initial state
const initialState = {
  roles: [
    {
      id: "reader",
      name: "Reader",
      description: "Read-only access to every resource in the project.",
      system: true,
      permissions: ALL_PERMISSIONS.filter((p) => p.endsWith(":read")),
      createdAt: "2025-07-01T10:00:00",
    },
    {
      id: "member",
      name: "Member",
      description: "Can read, create and update every resource, but not delete.",
      system: true,
      permissions: ALL_PERMISSIONS.filter((p) => !p.endsWith(":delete")),
      createdAt: "2025-07-01T10:00:00",
    },
    {
      id: "create-role",
      name: "Create Role",
      description: "Can create instances, networks and volumes.",
      system: false,
      permissions: [
        "instance:read",
        "instance:create",
        "network:read",
        "network:create",
        "volume:read",
        "volume:create",
      ],
      createdAt: "2025-07-18T11:20:00",
    },
  ],
};

export const RolesSlice = createSlice({
  name: "RolesSlice",
  initialState,
  reducers: {
    addRole: (state, action) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex((r) => r.id === action.payload.id);
      if (index !== -1 && !state.roles[index].system) {
        state.roles[index] = { ...state.roles[index], ...action.payload };
      }
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter((r) => r.system || r.id !== action.payload);
    },
  },
});

export const { addRole, updateRole, deleteRole } = RolesSlice.actions;
export default RolesSlice.reducer;
