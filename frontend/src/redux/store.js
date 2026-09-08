import reducer from "./AuthSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: reducer,
  },
});

export default store;
