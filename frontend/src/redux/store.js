import reducer from "./AuthSlice";
import rolesReducer from "./RolesSlice";
import usersReducer from "./UsersSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: reducer,
    roles: rolesReducer,
    users: usersReducer,
  },
});

export default store;
