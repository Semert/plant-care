// src/types/index.ts

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface Household {
  _id?: string;
  name: string;
  location: Location;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Plant {
  _id?: string;
  name: string;
  type: string;
  weeklyWaterNeed: number;
  expectedRelativeHumidity: number;
  householdId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlantHealth {
  _id?: string;
  plantId: string;
  date: Date;
  actualRainfall: number;
  actualHumidity: number;
  healthScore: number;
}
