import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyUser } from "../types/myUserType";

export interface UserState {
  currentUser: MyUser | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<MyUser | null>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
