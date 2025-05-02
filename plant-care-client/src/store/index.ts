import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import householdsReducer from "./slices/householdsSlice";
import plantsReducer from "./slices/plantsSlice";
import healthReducer from "./slices/healthSlice";
import uiReducer from "./slices/uiSlice";
import { rootEpic } from "./epics";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    households: householdsReducer,
    plants: plantsReducer,
    health: healthReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
