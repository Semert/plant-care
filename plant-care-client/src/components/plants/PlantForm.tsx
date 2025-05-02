import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { RootState } from "../../store";
import { plantsActions } from "../../store/slices/plantsSlice";
import { householdsActions } from "../../store/slices/householdsSlice";

interface PlantFormProps {
  isEdit?: boolean;
}

const PlantForm: React.FC<PlantFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentPlant,
    loading: plantLoading,
    error: plantError,
  } = useSelector((state: RootState) => state.plants);

  const { items: households, loading: householdsLoading } = useSelector(
    (state: RootState) => state.households
  );

  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    weeklyWaterNeed: number;
    expectedRelativeHumidity: number;
    householdId: string;
  }>({
    name: "",
    type: "",
    weeklyWaterNeed: 0,
    expectedRelativeHumidity: 0,
    householdId: "",
  });

  useEffect(() => {
    // Fetch households for dropdown
    dispatch(householdsActions.fetchHouseholdsRequest());

    // Fetch plant data if editing
    if (isEdit && id) {
      dispatch(plantsActions.fetchPlantByIdRequest(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentPlant) {
      setFormData({
        name: currentPlant.name,
        type: currentPlant.type,
        weeklyWaterNeed: currentPlant.weeklyWaterNeed,
        expectedRelativeHumidity: currentPlant.expectedRelativeHumidity,
        householdId: currentPlant.householdId,
      });
    }
  }, [isEdit, currentPlant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" || name === "type" ? value : Number(value),
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && id) {
      dispatch(
        plantsActions.updatePlantRequest({
          id,
          data: formData,
        })
      );
    } else {
      dispatch(plantsActions.createPlantRequest(formData));
    }

    navigate("/plants");
  };

  const loading = plantLoading || householdsLoading;

  if (isEdit && plantLoading && !currentPlant) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Plant" : "Add New Plant"}
      </Typography>

      {plantError && (
        <Typography color="error" gutterBottom>
          {plantError}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            label="Plant Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            label="Plant Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            helperText="e.g., Succulent, Fern, Flowering Plant"
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Weekly Water Need (mm)"
            name="weeklyWaterNeed"
            value={formData.weeklyWaterNeed}
            onChange={handleChange}
            inputProps={{
              min: 0,
              step: 0.1,
            }}
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Expected Relative Humidity (%)"
            name="expectedRelativeHumidity"
            value={formData.expectedRelativeHumidity}
            onChange={handleChange}
            inputProps={{
              min: 0,
              max: 100,
              step: 1,
            }}
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <FormControl fullWidth required>
            <InputLabel id="household-label">Household</InputLabel>
            <Select
              labelId="household-label"
              name="householdId"
              value={formData.householdId}
              onChange={handleSelectChange}
              label="Household"
            >
              {households.map((household) => (
                <MenuItem key={household.id} value={household.id}>
                  {household.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/plants")}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default PlantForm;
