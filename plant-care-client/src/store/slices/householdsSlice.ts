import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    // Request actions
    fetchHouseholdsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHouseholdByIdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    createHouseholdRequest: (
      state,
      action: PayloadAction<Omit<Household, "id" | "createdAt" | "updatedAt">>
    ) => {
      state.loading = true;
      state.error = null;
    },
    updateHouseholdRequest: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Household> }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    deleteHouseholdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },

    // Success actions
    fetchHouseholdsSuccess: (state, action: PayloadAction<Household[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchHouseholdByIdSuccess: (state, action: PayloadAction<Household>) => {
      state.currentHousehold = action.payload;
      state.loading = false;
    },
    createHouseholdSuccess: (state, action: PayloadAction<Household>) => {
      state.items.push(action.payload);
      state.currentHousehold = action.payload;
      state.loading = false;
    },
    updateHouseholdSuccess: (state, action: PayloadAction<Household>) => {
      const index = state.items.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.currentHousehold = action.payload;
      state.loading = false;
    },
    deleteHouseholdSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((h) => h.id !== action.payload);
      if (
        state.currentHousehold &&
        state.currentHousehold.id === action.payload
      ) {
        state.currentHousehold = null;
      }
      state.loading = false;
    },

    // Failure actions
    householdsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Other actions
    setCurrentHousehold: (state, action: PayloadAction<Household>) => {
      state.currentHousehold = action.payload;
    },
    clearCurrentHousehold: (state) => {
      state.currentHousehold = null;
    },
  },
});

export const householdsActions = householdsSlice.actions;
export default householdsSlice.reducer;
