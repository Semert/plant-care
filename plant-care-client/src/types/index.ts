// Location interface
export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

// Household interface
export interface Household {
  id: string;
  name: string;
  location: Location;
  createdAt: string;
  updatedAt: string;
}

// Plant interface
export interface Plant {
  id: string;
  name: string;
  type: string;
  weeklyWaterNeed: number;
  expectedRelativeHumidity: number;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

// Plant Health Record interface
export interface PlantHealth {
  id: string;
  plantId: string;
  date: string;
  actualRainfall: number;
  actualHumidity: number;
  healthScore: number;
}

// Date range for filtering
export interface DateRange {
  startDate: string;
  endDate: string;
}
