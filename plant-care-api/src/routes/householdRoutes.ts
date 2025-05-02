import express from "express";
import {
  getHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} from "../controllers/householdController";

const router = express.Router();

// GET /api/households
router.get("/", getHouseholds);

// GET /api/households/:id
router.get("/:id", getHouseholdById);

// POST /api/households
router.post("/", createHousehold);

// PUT /api/households/:id
router.put("/:id", updateHousehold);

// DELETE /api/households/:id
router.delete("/:id", deleteHousehold);

export default router;
