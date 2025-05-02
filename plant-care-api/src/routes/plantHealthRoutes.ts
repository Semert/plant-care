import express from "express";
import {
  getPlantHealth,
  getPlantHealthByDateRange,
  createHealthRecord,
} from "../controllers/plantHealthController";

const router = express.Router();

// GET /api/health/plant/:plantId
router.get("/plant/:plantId", getPlantHealth);

// GET /api/health/plant/:plantId/range
router.get("/plant/:plantId/range", getPlantHealthByDateRange);

// POST /api/health
router.post("/", createHealthRecord);

export default router;
