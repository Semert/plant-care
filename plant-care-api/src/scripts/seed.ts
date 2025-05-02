import mongoose from "mongoose";
import dotenv from "dotenv";
import Household from "../models/Household";
import Plant from "../models/Plant";
import PlantHealth from "../models/PlantHealth";

// Load environment variables
dotenv.config();

// Sample data
const sampleData = {
  households: [
    {
      name: "Home",
      location: {
        name: "Living Room",
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    {
      name: "Office",
      location: {
        name: "Desk Area",
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
  ],
  plants: [
    {
      name: "Peace Lily",
      type: "Flowering Plant",
      weeklyWaterNeed: 500, // in mm
      expectedRelativeHumidity: 60, // percentage
      // householdId will be set after creating households
    },
    {
      name: "Snake Plant",
      type: "Succulent",
      weeklyWaterNeed: 200,
      expectedRelativeHumidity: 40,
      // householdId will be set after creating households
    },
    {
      name: "Monstera",
      type: "Tropical",
      weeklyWaterNeed: 700,
      expectedRelativeHumidity: 65,
      // householdId will be set after creating households
    },
  ],
};

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/plant-care"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Household.deleteMany({});
    await Plant.deleteMany({});
    await PlantHealth.deleteMany({});
    console.log("Cleared existing data");

    // Create households
    const createdHouseholds = await Household.insertMany(sampleData.households);
    console.log(
      "Created households:",
      createdHouseholds.map((h) => h.name)
    );

    // Create plants with references to households
    const plantsWithHouseholdIds = sampleData.plants.map((plant, index) => {
      // Alternate between the two households
      const householdIndex = index % createdHouseholds.length;
      return {
        ...plant,
        householdId: createdHouseholds[householdIndex]._id,
      };
    });

    const createdPlants = await Plant.insertMany(plantsWithHouseholdIds);
    console.log(
      "Created plants:",
      createdPlants.map((p) => p.name)
    );

    // Create some sample health records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const healthRecords = [];

    for (const plant of createdPlants) {
      // Create health records for the last three days
      healthRecords.push({
        plantId: plant._id,
        date: today,
        actualRainfall: Math.random() * 100, // Random value between 0-100
        actualHumidity: 30 + Math.random() * 40, // Random value between 30-70
        healthScore: 50 + Math.random() * 50, // Random value between 50-100
      });

      healthRecords.push({
        plantId: plant._id,
        date: yesterday,
        actualRainfall: Math.random() * 100,
        actualHumidity: 30 + Math.random() * 40,
        healthScore: 50 + Math.random() * 50,
      });

      healthRecords.push({
        plantId: plant._id,
        date: twoDaysAgo,
        actualRainfall: Math.random() * 100,
        actualHumidity: 30 + Math.random() * 40,
        healthScore: 50 + Math.random() * 50,
      });
    }

    const createdHealthRecords = await PlantHealth.insertMany(healthRecords);
    console.log(`Created ${createdHealthRecords.length} health records`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();
