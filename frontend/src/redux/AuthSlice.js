import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
};

export const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearToken: (state, action) => {
      state.user = {};
      state.token = "";
      localStorage.clear("user");
      localStorage.clear("token");
    },
  },
});

export const { setToken, setUser, clearToken } = AuthSlice.actions;
export default AuthSlice.reducer;
