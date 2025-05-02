import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    // Request actions
    fetchPlantsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlantsByHouseholdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlantByIdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    createPlantRequest: (
      state,
      action: PayloadAction<Omit<Plant, "id" | "createdAt" | "updatedAt">>
    ) => {
      state.loading = true;
      state.error = null;
    },
    updatePlantRequest: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Plant> }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    deletePlantRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },

    // Success actions
    fetchPlantsSuccess: (state, action: PayloadAction<Plant[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchPlantsByHouseholdSuccess: (state, action: PayloadAction<Plant[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchPlantByIdSuccess: (state, action: PayloadAction<Plant>) => {
      state.currentPlant = action.payload;
      state.loading = false;
    },
    createPlantSuccess: (state, action: PayloadAction<Plant>) => {
      state.items.push(action.payload);
      state.currentPlant = action.payload;
      state.loading = false;
    },
    updatePlantSuccess: (state, action: PayloadAction<Plant>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.currentPlant = action.payload;
      state.loading = false;
    },
    deletePlantSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.currentPlant && state.currentPlant.id === action.payload) {
        state.currentPlant = null;
      }
      state.loading = false;
    },

    // Failure actions
    plantsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Other actions
    setCurrentPlant: (state, action: PayloadAction<Plant>) => {
      state.currentPlant = action.payload;
    },
    clearCurrentPlant: (state) => {
      state.currentPlant = null;
    },
  },
});

export const plantsActions = plantsSlice.actions;
export default plantsSlice.reducer;
