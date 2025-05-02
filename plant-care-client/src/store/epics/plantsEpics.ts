import { ofType } from "redux-observable";
import { of, from } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import api from "../../services/api";
import { plantsActions } from "../slices/plantsSlice";
import { uiActions } from "../slices/uiSlice";

// Epic to fetch all plants
export const fetchPlantsEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.fetchPlantsRequest.type),
    mergeMap(() =>
      from(api.get("/plants")).pipe(
        map((response) => {
          // Transform API response
          const plants = response.data.map((p: any) => ({
            id: p._id,
            name: p.name,
            type: p.type,
            weeklyWaterNeed: p.weeklyWaterNeed,
            expectedRelativeHumidity: p.expectedRelativeHumidity,
            householdId: p.householdId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }));
          return plantsActions.fetchPlantsSuccess(plants);
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to fetch plants";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to fetch plants by household
export const fetchPlantsByHouseholdEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.fetchPlantsByHouseholdRequest.type),
    mergeMap((action) =>
      from(
        api.get(`/plants/household/${(action as { payload: string }).payload}`)
      ).pipe(
        map((response) => {
          // Transform API response
          const plants = response.data.map((p: any) => ({
            id: p._id,
            name: p.name,
            type: p.type,
            weeklyWaterNeed: p.weeklyWaterNeed,
            expectedRelativeHumidity: p.expectedRelativeHumidity,
            householdId: p.householdId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }));
          return plantsActions.fetchPlantsByHouseholdSuccess(plants);
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to fetch plants for this household";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to fetch a single plant by ID
export const fetchPlantByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.fetchPlantByIdRequest.type),
    mergeMap((action) =>
      from(api.get(`/plants/${(action as { payload: string }).payload}`)).pipe(
        map((response) => {
          // Transform API response
          const plant = {
            id: response.data._id,
            name: response.data.name,
            type: response.data.type,
            weeklyWaterNeed: response.data.weeklyWaterNeed,
            expectedRelativeHumidity: response.data.expectedRelativeHumidity,
            householdId: response.data.householdId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          return plantsActions.fetchPlantByIdSuccess(plant);
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to fetch plant";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to create a new plant
export const createPlantEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.createPlantRequest.type),
    mergeMap((action) =>
      from(api.post("/plants", (action as { payload: string }).payload)).pipe(
        map((response) => {
          // Transform API response
          const plant = {
            id: response.data._id,
            name: response.data.name,
            type: response.data.type,
            weeklyWaterNeed: response.data.weeklyWaterNeed,
            expectedRelativeHumidity: response.data.expectedRelativeHumidity,
            householdId: response.data.householdId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          return of(
            plantsActions.createPlantSuccess(plant),
            uiActions.setAlert({
              type: "success",
              message: `Plant "${plant.name}" created successfully`,
            })
          );
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to create plant";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to update a plant
export const updatePlantEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.updatePlantRequest.type),
    mergeMap((action) =>
      from(
        api.put(
          `/plants/${
            (action as { payload: { id: number; data: string } }).payload.id
          }`,
          (action as { payload: { id: number; data: string } }).payload.data
        )
      ).pipe(
        map((response) => {
          // Transform API response
          const plant = {
            id: response.data._id,
            name: response.data.name,
            type: response.data.type,
            weeklyWaterNeed: response.data.weeklyWaterNeed,
            expectedRelativeHumidity: response.data.expectedRelativeHumidity,
            householdId: response.data.householdId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          return of(
            plantsActions.updatePlantSuccess(plant),
            uiActions.setAlert({
              type: "success",
              message: `Plant "${plant.name}" updated successfully`,
            })
          );
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update plant";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to delete a plant
export const deletePlantEpic = (action$: any) =>
  action$.pipe(
    ofType(plantsActions.deletePlantRequest.type),
    mergeMap((action) =>
      from(
        api.delete(`/plants/${(action as { payload: string }).payload}`)
      ).pipe(
        map(() => {
          return of(
            plantsActions.deletePlantSuccess(
              (action as { payload: string }).payload
            ),
            uiActions.setAlert({
              type: "success",
              message: "Plant deleted successfully",
            })
          );
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to delete plant";
          return of(
            plantsActions.plantsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );
