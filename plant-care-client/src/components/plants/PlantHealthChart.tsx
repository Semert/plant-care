import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, subDays } from "date-fns";
import { RootState } from "../../store";
import { healthActions } from "../../store/slices/healthSlice";

interface PlantHealthChartProps {
  plantId: string;
}

const PlantHealthChart: React.FC<PlantHealthChartProps> = ({ plantId }) => {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector(
    (state: RootState) => state.health
  );

  const [startDate, setStartDate] = useState<Date | null>(
    subDays(new Date(), 30)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        healthActions.fetchPlantHealthByDateRangeRequest({
          plantId,
          dateRange: {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          },
        })
      );
    } else {
      dispatch(healthActions.fetchPlantHealthRequest(plantId));
    }
  }, [dispatch, plantId, startDate, endDate]);

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (startDate && endDate) {
      dispatch(
        healthActions.fetchPlantHealthByDateRangeRequest({
          plantId,
          dateRange: {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          },
        })
      );
    }
  };

  // Format the data for the chart
  const plantHealthRecords = records[plantId] || [];
  const chartData = plantHealthRecords.map((record) => ({
    date: format(new Date(record.date), "MMM dd"),
    healthScore: record.healthScore,
    rainfall: record.actualRainfall,
    humidity: record.actualHumidity,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Plant Health History
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleDateRangeSubmit}>
            <Typography variant="subtitle2" gutterBottom>
              Select Date Range
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue: React.SetStateAction<Date | null>) =>
                  setStartDate(newValue)
                }
              />
              <Typography>to</Typography>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue: React.SetStateAction<Date | null>) =>
                  setEndDate(newValue)
                }
                maxDate={new Date()}
              />
              <Button type="submit" variant="contained">
                Apply
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData.length === 0 ? (
        <Typography>No health records found for this plant.</Typography>
      ) : (
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="healthScore"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Health Score"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainfall"
                stroke="#82ca9d"
                name="Rainfall (mm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#ffc658"
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default PlantHealthChart;
