import { ofType } from "redux-observable";
import { of, from } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import api from "../../services/api";
import { healthActions } from "../slices/healthSlice";
import { uiActions } from "../slices/uiSlice";

// Epic to fetch health records for a plant
export const fetchPlantHealthEpic = (action$: any) =>
  action$.pipe(
    ofType(healthActions.fetchPlantHealthRequest.type),
    mergeMap((action: { type: string; payload: string }) =>
      from(api.get(`/health/plant/${action.payload}`)).pipe(
        map((response) => {
          // Transform API response to match expected format
          const records = response.data.map((record: any) => ({
            id: record._id,
            plantId: record.plantId,
            date: record.date,
            actualRainfall: record.actualRainfall,
            actualHumidity: record.actualHumidity,
            healthScore: record.healthScore,
          }));

          // Important: Return the correct structure expected by the reducer
          return healthActions.fetchPlantHealthSuccess({
            plantId: action.payload,
            records: records,
          });
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to fetch plant health records";
          return [
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg }),
          ];
        })
      )
    )
  );

// Epic to fetch health records for a plant by date range
export const fetchPlantHealthByDateRangeEpic = (action$: any) =>
  action$.pipe(
    ofType(healthActions.fetchPlantHealthByDateRangeRequest.type),
    mergeMap((action) => {
      const { plantId, dateRange } = (
        action as { payload: { plantId: string; dateRange: any } }
      ).payload;
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      return from(api.get(`/health/plant/${plantId}/range`, { params })).pipe(
        map((response) => {
          // Transform API response
          const records = response.data.map((record: any) => ({
            id: record._id,
            plantId: record.plantId,
            date: record.date,
            actualRainfall: record.actualRainfall,
            actualHumidity: record.actualHumidity,
            healthScore: record.healthScore,
          }));
          return healthActions.fetchPlantHealthSuccess({
            plantId,
            records,
          });
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to fetch plant health records for the date range";
          return of(
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      );
    })
  );

export const updatePlantHealthEpic = (action$: any) =>
  action$.pipe(
    ofType(healthActions.updatePlantHealthRequest.type),
    mergeMap((action: { type: string; payload: string }) =>
      from(api.post(`/health/plant/${action.payload}/update`)).pipe(
        // Changed 'map' to 'mergeMap' to handle multiple actions
        mergeMap((response) => {
          // Transform API response
          const healthRecord = {
            id: response.data.healthRecord._id,
            plantId: response.data.healthRecord.plantId,
            date: response.data.healthRecord.date,
            actualRainfall: response.data.healthRecord.actualRainfall,
            actualHumidity: response.data.healthRecord.actualHumidity,
            healthScore: response.data.healthRecord.healthScore,
          };
          // Return array of actions instead of using 'of'
          return [
            healthActions.updatePlantHealthSuccess(healthRecord),
            uiActions.setAlert({
              type: "success",
              message: "Plant health updated successfully",
            }),
          ];
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update plant health";
          // Return array of actions instead of using 'of'
          return [
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({
              type: "error",
              message: errorMsg,
            }),
          ];
        })
      )
    )
  );

// Epic to update health for all plants
export const updateAllPlantsHealthEpic = (action$: any) =>
  action$.pipe(
    ofType(healthActions.updateAllPlantsHealthRequest.type),
    mergeMap(() =>
      from(api.post("/health/update")).pipe(
        // Changed 'map' to 'mergeMap' to handle multiple actions
        mergeMap((response) => {
          // Return array of actions instead of using 'of'
          return [
            healthActions.updateAllPlantsHealthSuccess(),
            uiActions.setAlert({
              type: "success",
              message: `Successfully updated health for ${response.data.count} plants`,
            }),
          ];
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update all plants health";
          // Return array of actions instead of using 'of'
          return [
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg }),
          ];
        })
      )
    )
  );
