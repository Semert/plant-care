import { Request, Response } from "express";
import { Household } from "../models";

// Get all households
export const getHouseholds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const households = await Household.find().sort({ createdAt: -1 });
    res.status(200).json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Get household by ID
export const getHouseholdById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      res.status(404).json({ message: "Household not found" });
      return;
    }

    res.status(200).json(household);
  } catch (error) {
    console.error("Error fetching household:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Create a new household
export const createHousehold = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, location } = req.body;

    const newHousehold = new Household({
      name,
      location,
    });

    const savedHousehold = await newHousehold.save();
    res.status(201).json(savedHousehold);
  } catch (error) {
    console.error("Error creating household:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Update a household
export const updateHousehold = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, location } = req.body;

    const household = await Household.findById(req.params.id);

    if (!household) {
      res.status(404).json({ message: "Household not found" });
      return;
    }

    const updatedHousehold = await Household.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedHousehold);
  } catch (error) {
    console.error("Error updating household:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// Delete a household
export const deleteHousehold = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      res.status(404).json({ message: "Household not found" });
      return;
    }

    await Household.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Household deleted successfully" });
  } catch (error) {
    console.error("Error deleting household:", error);
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
