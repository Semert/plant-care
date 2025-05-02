import { combineEpics } from "redux-observable";
import {
  fetchHouseholdsEpic,
  fetchHouseholdByIdEpic,
  createHouseholdEpic,
  updateHouseholdEpic,
  deleteHouseholdEpic,
} from "./householdsEpics";
import {
  fetchPlantsEpic,
  fetchPlantsByHouseholdEpic,
  fetchPlantByIdEpic,
  createPlantEpic,
  updatePlantEpic,
  deletePlantEpic,
} from "./plantsEpics";
import {
  fetchPlantHealthEpic,
  fetchPlantHealthByDateRangeEpic,
  updatePlantHealthEpic,
  updateAllPlantsHealthEpic,
} from "./healthEpics";

export const rootEpic = combineEpics(
  // Households epics
  fetchHouseholdsEpic,
  fetchHouseholdByIdEpic,
  createHouseholdEpic,
  updateHouseholdEpic,
  deleteHouseholdEpic,

  // Plants epics
  fetchPlantsEpic,
  fetchPlantsByHouseholdEpic,
  fetchPlantByIdEpic,
  createPlantEpic,
  updatePlantEpic,
  deletePlantEpic,

  // Health epics
  fetchPlantHealthEpic,
  fetchPlantHealthByDateRangeEpic,
  updatePlantHealthEpic,
  updateAllPlantsHealthEpic
);
