import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { uiActions } from "../../store/slices/uiSlice";

const healthStatusOptions = [
  { value: "good", label: "Good", color: "success" },
  { value: "warning", label: "Warning", color: "warning" },
  { value: "critical", label: "Critical", color: "error" },
];

const PlantFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { searchTerm, filters } = useSelector((state: RootState) => state.ui);
  const { items: plants } = useSelector((state: RootState) => state.plants);

  // Extract unique plant types from the plant list
  const plantTypes = [...new Set(plants.map((plant) => plant.type))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(uiActions.setSearchTerm(e.target.value));
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    dispatch(
      uiActions.setFilters({
        plantType: e.target.value || null,
      })
    );
  };

  const handleHealthStatusChange = (e: SelectChangeEvent<string>) => {
    dispatch(
      uiActions.setFilters({
        healthStatus: (e.target.value as any) || null,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(uiActions.resetFilters());
    dispatch(uiActions.setSearchTerm(""));
  };

  const hasActiveFilters =
    searchTerm || filters.plantType || filters.healthStatus;

  return (
    <Box mb={3}>
      <Grid container spacing={2}>
        <Grid sx={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Search Plants"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or type..."
          />
        </Grid>

        <Grid sx={{ xs: 12, md: 3 }}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="plant-type-label">Plant Type</InputLabel>
            <Select
              labelId="plant-type-label"
              value={filters.plantType || ""}
              onChange={handleTypeChange}
              label="Plant Type"
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              {plantTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid sx={{ xs: 12, md: 3 }}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="health-status-label">Health Status</InputLabel>
            <Select
              labelId="health-status-label"
              value={filters.healthStatus || ""}
              onChange={handleHealthStatusChange}
              label="Health Status"
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {healthStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid sx={{ xs: 12, md: 2 }}>
          {hasActiveFilters && (
            <IconButton onClick={handleClearFilters} title="Clear filters">
              <CloseIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => dispatch(uiActions.setSearchTerm(""))}
            />
          )}

          {filters.plantType && (
            <Chip
              label={`Type: ${filters.plantType}`}
              onDelete={() =>
                dispatch(uiActions.setFilters({ plantType: null }))
              }
            />
          )}

          {filters.healthStatus && (
            <Chip
              label={`Status: ${
                healthStatusOptions.find(
                  (o) => o.value === filters.healthStatus
                )?.label
              }`}
              color={
                healthStatusOptions.find(
                  (o) => o.value === filters.healthStatus
                )?.color as any
              }
              onDelete={() =>
                dispatch(uiActions.setFilters({ healthStatus: null }))
              }
            />
          )}
        </Box>
      )}

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default PlantFilters;
