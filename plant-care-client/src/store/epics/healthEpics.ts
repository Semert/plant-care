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
    mergeMap((action) =>
      from(
        api.get(`/health/plant/${(action as { payload: string }).payload}`)
      ).pipe(
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
            plantId: (action as { payload: string }).payload,
            records,
          });
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to fetch plant health records";
          return of(
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
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

// Epic to update health for a specific plant
export const updatePlantHealthEpic = (action$: any) =>
  action$.pipe(
    ofType(healthActions.updatePlantHealthRequest.type),
    mergeMap((action) =>
      from(
        api.post(
          `/health/plant/${(action as { payload: string }).payload}/update`
        )
      ).pipe(
        map((response) => {
          // Transform API response
          const healthRecord = {
            id: response.data.healthRecord._id,
            plantId: response.data.healthRecord.plantId,
            date: response.data.healthRecord.date,
            actualRainfall: response.data.healthRecord.actualRainfall,
            actualHumidity: response.data.healthRecord.actualHumidity,
            healthScore: response.data.healthRecord.healthScore,
          };
          return of(
            healthActions.updatePlantHealthSuccess(healthRecord),
            uiActions.setAlert({
              type: "success",
              message: "Plant health updated successfully",
            })
          );
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update plant health";
          return of(
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
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
        map((response) => {
          return of(
            healthActions.updateAllPlantsHealthSuccess(),
            uiActions.setAlert({
              type: "success",
              message: `Successfully updated health for ${response.data.count} plants`,
            })
          );
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update all plants health";
          return of(
            healthActions.healthFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );
