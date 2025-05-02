import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alert {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface UiState {
  alerts: Alert[];
  searchTerm: string;
  filters: {
    plantType: string | null;
    healthStatus: "good" | "warning" | "critical" | null;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
}

const initialState: UiState = {
  alerts: [],
  searchTerm: "",
  filters: {
    plantType: null,
    healthStatus: null,
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<Omit<Alert, "id">>) => {
      const id = Date.now().toString();
      state.alerts.push({
        id,
        ...action.payload,
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UiState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
