import { Plant, PlantHealth, Household } from "../models";
import { fetchWeatherData } from "./weatherService";
import { calculateHealthScore } from "./healthCalculationService";

/**
 * Updates health records for all plants based on current weather data
 * @returns Array of created health records
 */
export const updateAllPlantsHealth = async (): Promise<any[]> => {
  try {
    // Get all plants with their household information
    const plants = await Plant.find().populate("householdId");

    const healthRecords = [];

    // Process each plant
    for (const plant of plants) {
      const household = plant.householdId as any;

      // Skip plants with invalid household
      if (!household || !household.location) continue;

      // Fetch weather data for this plant's location
      const weatherData = await fetchWeatherData(household.location);

      // Calculate health score
      const healthScore = calculateHealthScore(
        plant.weeklyWaterNeed,
        weatherData.rainfall,
        plant.expectedRelativeHumidity,
        weatherData.humidity
      );

      // Create a new health record
      const healthRecord = new PlantHealth({
        plantId: plant._id,
        date: weatherData.date,
        actualRainfall: weatherData.rainfall,
        actualHumidity: weatherData.humidity,
        healthScore,
      });

      // Save the health record
      const savedRecord = await healthRecord.save();
      healthRecords.push(savedRecord);
    }

    return healthRecords;
  } catch (error) {
    console.error("Error updating plant health:", error);
    throw error;
  }
};

/**
 * Updates health for a specific plant
 * @param plantId ID of the plant to update
 * @returns Created health record
 */
export const updatePlantHealth = async (plantId: string): Promise<any> => {
  try {
    // Get the plant with its household information
    const plant = await Plant.findById(plantId).populate("householdId");

    if (!plant) {
      throw new Error("Plant not found");
    }

    const household = plant.householdId as any;

    if (!household || !household.location) {
      throw new Error("Invalid household or location data for this plant");
    }

    // Fetch weather data for this plant's location
    const weatherData = await fetchWeatherData(household.location);

    // Calculate health score
    const healthScore = calculateHealthScore(
      plant.weeklyWaterNeed,
      weatherData.rainfall,
      plant.expectedRelativeHumidity,
      weatherData.humidity
    );

    // Create a new health record
    const healthRecord = new PlantHealth({
      plantId: plant._id,
      date: weatherData.date,
      actualRainfall: weatherData.rainfall,
      actualHumidity: weatherData.humidity,
      healthScore,
    });

    // Save the health record
    const savedRecord = await healthRecord.save();
    return savedRecord;
  } catch (error) {
    console.error(`Error updating plant health for plant ${plantId}:`, error);
    throw error;
  }
};
