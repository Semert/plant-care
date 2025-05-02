import { Request, Response } from "express";
import { PlantHealth, Plant } from "../models";

// Get health records for a plant
export const getPlantHealth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plantId = req.params.plantId;

    // Verify the plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    const healthRecords = await PlantHealth.find({ plantId }).sort({
      date: -1,
    });
    res.status(200).json(healthRecords);
  } catch (error) {
    console.error("Error fetching plant health records:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Get plant health within date range
export const getPlantHealthByDateRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { plantId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Start date and end date are required" });
      return;
    }

    // Verify the plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    const healthRecords = await PlantHealth.find({
      plantId,
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    }).sort({ date: 1 });

    res.status(200).json(healthRecords);
  } catch (error) {
    console.error("Error fetching plant health records by date range:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Create a new health record
export const createHealthRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { plantId, date, actualRainfall, actualHumidity, healthScore } =
      req.body;

    // Verify the plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    const newHealthRecord = new PlantHealth({
      plantId,
      date: date || new Date(),
      actualRainfall,
      actualHumidity,
      healthScore,
    });

    const savedRecord = await newHealthRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error creating health record:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
