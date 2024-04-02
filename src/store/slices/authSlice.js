import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
    token: null,
    avatar: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, accessToken, avatar } = action.payload;
      state.email = email;
      state.token = accessToken;
      state.avatar = avatar;
    },
    logOut: (state, action) => {
      state.email = null;
      state.token = null;
      state.avatar = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state?.auth?.email;
export const selectCurrentToken = (state) => state?.auth?.token;
export const selectCurrentAvatar = (state) => state?.auth?.avatar;