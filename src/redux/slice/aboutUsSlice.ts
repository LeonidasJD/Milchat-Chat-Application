import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AboutUs } from "../types/aboutUsType";

export interface AboutUsState {
  text: AboutUs | null;
}

const initialState: AboutUsState = {
  text: null,
};

const aboutUsSlice = createSlice({
  name: "aboutUsText",
  initialState,
  reducers: {
    setAboutUsText(state, action: PayloadAction<AboutUs | null>) {
      state.text = action.payload;
    },
  },
});

export const { setAboutUsText } = aboutUsSlice.actions;
export default aboutUsSlice.reducer;
