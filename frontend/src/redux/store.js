import reducer from "./AuthSlice";
import rolesReducer from "./RolesSlice";
import usersReducer from "./UsersSlice";
import projectReducer from "./ProjectSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: reducer,
    roles: rolesReducer,
    users: usersReducer,
    project: projectReducer,
  },
});

export default store;
