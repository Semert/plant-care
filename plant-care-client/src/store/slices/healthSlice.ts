import { createSlice } from "@reduxjs/toolkit";
import { PlantHealth, DateRange } from "../../types";

interface HealthState {
  records: Record<string, PlantHealth[]>; // Indexed by plantId
  dateRange: DateRange | null;
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  records: {},
  dateRange: null,
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    // TODO: add actions later
  },
});

export default healthSlice.reducer;
