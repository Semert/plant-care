import axios from "axios";
import { Location } from "../types";

// Interface for the weather data we'll extract from the API
export interface WeatherData {
  date: Date;
  rainfall: number; // in millimeters
  humidity: number; // percentage
}

/**
 * Fetches weather data for a specific location and date
 * @param location The location to fetch weather data for
 * @param date Optional date (defaults to current date)
 * @returns Promise with WeatherData object
 */
export const fetchWeatherData = async (
  location: Location,
  date: Date = new Date()
): Promise<WeatherData> => {
  try {
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split("T")[0];

    // Call the Open-Meteo API
    const response = await axios.get(
      "https://archive-api.open-meteo.com/v1/archive",
      {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          start_date: dateString,
          end_date: dateString,
          daily: "rain_sum,relative_humidity_2m_mean",
          timezone: "auto",
        },
      }
    );

    // Extract the needed data from the response
    const data = response.data;

    // Check if we have valid data
    if (
      !data.daily ||
      !data.daily.rain_sum ||
      !data.daily.relative_humidity_2m_mean
    ) {
      throw new Error("Invalid or missing weather data from API");
    }

    // Return the formatted weather data
    return {
      date: new Date(data.daily.time[0]),
      rainfall: data.daily.rain_sum[0] || 0, // Default to 0 if null
      humidity: data.daily.relative_humidity_2m_mean[0] || 0, // Default to 0 if null
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error(
      `Failed to fetch weather data: ${(error as Error).message}`
    );
  }
};
