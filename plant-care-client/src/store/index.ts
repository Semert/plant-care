import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics";
import householdsReducer from "./slices/householdsSlice";
import plantsReducer from "./slices/plantsSlice";
import healthReducer from "./slices/healthSlice";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    households: householdsReducer,
    plants: plantsReducer,
    health: healthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
