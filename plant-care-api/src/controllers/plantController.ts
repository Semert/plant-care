import { Request, Response } from "express";
import { Plant, Household } from "../models";

// Get all plants
export const getPlants = async (req: Request, res: Response): Promise<void> => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Get plants by household ID
export const getPlantsByHousehold = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const householdId = req.params.householdId;

    // Verify the household exists
    const household = await Household.findById(householdId);
    if (!household) {
      res.status(404).json({ message: "Household not found" });
      return;
    }

    const plants = await Plant.find({ householdId }).sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching plants by household:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Get plant by ID
export const getPlantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    res.status(200).json(plant);
  } catch (error) {
    console.error("Error fetching plant:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Create a new plant
export const createPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      type,
      weeklyWaterNeed,
      expectedRelativeHumidity,
      householdId,
    } = req.body;

    // Verify the household exists
    const household = await Household.findById(householdId);
    if (!household) {
      res.status(404).json({ message: "Household not found" });
      return;
    }

    const newPlant = new Plant({
      name,
      type,
      weeklyWaterNeed,
      expectedRelativeHumidity,
      householdId,
    });

    const savedPlant = await newPlant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error("Error creating plant:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Update a plant
export const updatePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      type,
      weeklyWaterNeed,
      expectedRelativeHumidity,
      householdId,
    } = req.body;

    // If householdId is provided, verify it exists
    if (householdId) {
      const household = await Household.findById(householdId);
      if (!household) {
        res.status(404).json({ message: "Household not found" });
        return;
      }
    }

    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { name, type, weeklyWaterNeed, expectedRelativeHumidity, householdId },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPlant);
  } catch (error) {
    console.error("Error updating plant:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Delete a plant
export const deletePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
