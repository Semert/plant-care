import { createSlice } from "@reduxjs/toolkit";
import { Household } from "../../types";

interface HouseholdsState {
  items: Household[];
  currentHousehold: Household | null;
  loading: boolean;
  error: string | null;
}

const initialState: HouseholdsState = {
  items: [],
  currentHousehold: null,
  loading: false,
  error: null,
};

const householdsSlice = createSlice({
  name: "households",
  initialState,
  reducers: {
    // TODO: add actions later
  },
});

export default householdsSlice.reducer;
