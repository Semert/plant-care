import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlantHealth, DateRange } from "../../types";

interface HealthState {
  records: Record<string, PlantHealth[]>;
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
    // Request actions
    fetchPlantHealthRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlantHealthByDateRangeRequest: (
      state,
      action: PayloadAction<{ plantId: string; dateRange: DateRange }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    updatePlantHealthRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    updateAllPlantsHealthRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Success actions
    fetchPlantHealthSuccess: (
      state,
      action: PayloadAction<{ plantId: string; records: PlantHealth[] }>
    ) => {
      const { plantId, records } = action.payload;
      state.records[plantId] = records;
      state.loading = false;
    },

    updatePlantHealthSuccess: (state, action: PayloadAction<PlantHealth>) => {
      const { plantId } = action.payload;
      if (!state.records[plantId]) {
        state.records[plantId] = [];
      }

      state.records[plantId] = [action.payload, ...state.records[plantId]].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      state.loading = false;
    },
    updateAllPlantsHealthSuccess: (state) => {
      state.loading = false;
    },

    // Failure actions
    healthFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Other actions
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    clearDateRange: (state) => {
      state.dateRange = null;
    },
  },
});

export const healthActions = healthSlice.actions;
export default healthSlice.reducer;
