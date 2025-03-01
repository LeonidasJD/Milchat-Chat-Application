import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import aboutUsReducer from "./slice/aboutUsSlice";
import selectedUserReducer from "./slice/selectedUserSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    aboutUsText: aboutUsReducer,
    setSelectedUserData: selectedUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
