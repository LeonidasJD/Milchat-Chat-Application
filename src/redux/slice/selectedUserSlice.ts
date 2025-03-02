import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserId {
  userId: string | null;
  userName: string | null;
}

const initialState: UserId = {
  userId: null,
  userName: null,
};

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {
    setSelectedUserData(
      state,
      action: PayloadAction<{ userId: string | null; userName: string | null }>
    ) {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
    },
  },
});

export const { setSelectedUserData } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;
