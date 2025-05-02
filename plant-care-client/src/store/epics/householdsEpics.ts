import { ofType } from "redux-observable";
import { of, from } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import api from "../../services/api";
import { householdsActions } from "../slices/householdsSlice";
import { uiActions } from "../slices/uiSlice";

// Epic to fetch all households
export const fetchHouseholdsEpic = (action$: any) =>
  action$.pipe(
    ofType(householdsActions.fetchHouseholdsRequest.type),
    mergeMap(() =>
      from(api.get("/households")).pipe(
        map((response) => {
          // Transform API response to match our frontend models
          const households = response.data.map((h: any) => ({
            id: h._id,
            name: h.name,
            location: h.location,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
          }));
          return householdsActions.fetchHouseholdsSuccess(households);
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to fetch households";
          return of(
            householdsActions.householdsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to fetch a single household by ID
export const fetchHouseholdByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(householdsActions.fetchHouseholdByIdRequest.type),
    mergeMap((action) =>
      from(
        api.get(`/households/${(action as { payload: string }).payload}`)
      ).pipe(
        map((response) => {
          // Transform API response
          const household = {
            id: response.data._id,
            name: response.data.name,
            location: response.data.location,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          return householdsActions.fetchHouseholdByIdSuccess(household);
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to fetch household";
          return of(
            householdsActions.householdsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg })
          );
        })
      )
    )
  );

// Epic to create a new household
export const createHouseholdEpic = (action$: any) =>
  action$.pipe(
    ofType(householdsActions.createHouseholdRequest.type),
    mergeMap((action: { type: string; payload: string }) =>
      from(api.post("/households", action.payload)).pipe(
        // Changed 'map' to 'mergeMap' to handle multiple actions
        mergeMap((response) => {
          // Transform API response
          const household = {
            id: response.data._id,
            name: response.data.name,
            location: response.data.location,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          // Return array of actions instead of using 'of'
          return [
            householdsActions.createHouseholdSuccess(household),
            uiActions.setAlert({
              type: "success",
              message: `Household "${household.name}" created successfully`,
            }),
          ];
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to create household";
          // Return array of actions instead of using 'of'
          return [
            householdsActions.householdsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg }),
          ];
        })
      )
    )
  );

// Epic to update a household
export const updateHouseholdEpic = (action$: any) =>
  action$.pipe(
    ofType(householdsActions.updateHouseholdRequest.type),
    mergeMap((action: { type: string; payload: string }) =>
      from(
        // @ts-ignore
        api.put(`/households/${action.payload.id}`, action.payload.data)
      ).pipe(
        // The problem is here - map should return an action, not an observable
        mergeMap((response) => {
          // Transform API response
          const household = {
            id: response.data._id,
            name: response.data.name,
            location: response.data.location,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          };
          // Return array of actions instead of using 'of'
          return [
            householdsActions.updateHouseholdSuccess(household),
            uiActions.setAlert({
              type: "success",
              message: `Household "${household.name}" updated successfully`,
            }),
          ];
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to update household";
          // Return array of actions instead of using 'of'
          return [
            householdsActions.householdsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg }),
          ];
        })
      )
    )
  );

// Epic to delete a household
export const deleteHouseholdEpic = (action$: any) =>
  action$.pipe(
    ofType(householdsActions.deleteHouseholdRequest.type),
    mergeMap((action: { type: string; payload: string }) =>
      from(api.delete(`/households/${action.payload}`)).pipe(
        mergeMap(() => {
          return [
            householdsActions.deleteHouseholdSuccess(action.payload),
            uiActions.setAlert({
              type: "success",
              message: "Household deleted successfully",
            }),
          ];
        }),
        catchError((err) => {
          const errorMsg =
            err.response?.data?.message || "Failed to delete household";
          // Return array of actions instead of using 'of'
          return [
            householdsActions.householdsFailure(errorMsg),
            uiActions.setAlert({ type: "error", message: errorMsg }),
          ];
        })
      )
    )
  );
