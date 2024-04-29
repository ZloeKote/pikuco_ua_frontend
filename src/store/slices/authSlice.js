import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
    nickname: null,
    token: null,
    avatar: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, nickname, accessToken, avatar } = action.payload;
      state.email = email;
      state.nickname = nickname;
      state.token = accessToken;
      state.avatar = avatar;
    },
    logOut: (state, action) => {
      state.email = null;
      state.nickname = null;
      state.token = null;
      state.avatar = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => {
  return { email: state?.auth?.email, nickname: state?.auth?.nickname };
};
export const selectCurrentToken = (state) => state?.auth?.token;
export const selectCurrentAvatar = (state) => state?.auth?.avatar;
