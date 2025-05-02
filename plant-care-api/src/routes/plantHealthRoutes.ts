import express from "express";
import {
  getPlantHealth,
  getPlantHealthByDateRange,
  createHealthRecord,
  updateAllHealth,
  updateSinglePlantHealth,
} from "../controllers/plantHealthController";

const router = express.Router();

// GET /api/health/plant/:plantId
router.get("/plant/:plantId", getPlantHealth);

// GET /api/health/plant/:plantId/range
router.get("/plant/:plantId/range", getPlantHealthByDateRange);

// POST /api/health
router.post("/", createHealthRecord);

// POST /api/health/update
router.post("/update", updateAllHealth);

// POST /api/health/plant/:plantId/update
router.post("/plant/:plantId/update", updateSinglePlantHealth);

export default router;
