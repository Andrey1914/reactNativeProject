import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  name: null,
  email: null,
  avatar: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => state,
    // authLogout: () => initialState,
    // updateAvatarAction: (state, { payload }) => ({
    //   ...state,
    //   avatar: payload.avatar,
    // }),
  },
});
