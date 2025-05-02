/**
 * Calculates health score for a plant based on water and humidity needs vs. actual conditions
 * @param expectedWaterNeed Weekly water need in mm
 * @param actualRainfall Actual rainfall in mm
 * @param expectedHumidity Expected humidity percentage
 * @param actualHumidity Actual humidity percentage
 * @returns Health score (0-100)
 */
export const calculateHealthScore = (
  expectedWaterNeed: number,
  actualRainfall: number,
  expectedHumidity: number,
  actualHumidity: number
): number => {
  // Convert weekly water need to daily
  const dailyWaterNeed = expectedWaterNeed / 7;

  // Calculate water score (60% of total)
  const waterRatio = actualRainfall / dailyWaterNeed;

  // Score water: ideal is between 80-120% of needed amount
  // Lower if under-watered, also lower if over-watered
  let waterScore: number;
  if (waterRatio >= 0.8 && waterRatio <= 1.2) {
    // Perfect range: full score
    waterScore = 100;
  } else if (waterRatio < 0.8) {
    // Under-watering: proportional reduction
    waterScore = (waterRatio / 0.8) * 100;
  } else {
    // Over-watering: gradually reduce score as ratio increases
    waterScore = Math.max(0, 100 - ((waterRatio - 1.2) / 0.8) * 100);
  }

  // Calculate humidity score (40% of total)
  const humidityDiff = Math.abs(expectedHumidity - actualHumidity);
  // Allow 10% tolerance for humidity
  const humidityTolerance = 10;

  let humidityScore: number;
  if (humidityDiff <= humidityTolerance) {
    // Within tolerance: full score
    humidityScore = 100;
  } else {
    // Outside tolerance: gradually reduce score
    humidityScore = Math.max(
      0,
      100 - ((humidityDiff - humidityTolerance) / 50) * 100
    );
  }

  // Calculate final score (weighted average)
  const finalScore = waterScore * 0.6 + humidityScore * 0.4;

  // Round to nearest integer and ensure it's between 0-100
  return Math.min(100, Math.max(0, Math.round(finalScore)));
};
