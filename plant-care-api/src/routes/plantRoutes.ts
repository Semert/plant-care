import express from "express";
import {
  getPlants,
  getPlantsByHousehold,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../controllers/plantController";

const router = express.Router();

// GET /api/plants
router.get("/", getPlants);

// GET /api/plants/household/:householdId
router.get("/household/:householdId", getPlantsByHousehold);

// GET /api/plants/:id
router.get("/:id", getPlantById);

// POST /api/plants
router.post("/", createPlant);

// PUT /api/plants/:id
router.put("/:id", updatePlant);

// DELETE /api/plants/:id
router.delete("/:id", deletePlant);

export default router;
