import { createSlice } from "@reduxjs/toolkit";
import { Plant } from "../../types";

interface PlantsState {
  items: Plant[];
  currentPlant: Plant | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlantsState = {
  items: [],
  currentPlant: null,
  loading: false,
  error: null,
};

const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    // TODO: add actions later
  },
});

export default plantsSlice.reducer;
