import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import aboutUsReducer from "./slice/aboutUsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    aboutUsText: aboutUsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
