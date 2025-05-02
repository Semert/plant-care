// src/components/households/HouseholdForm.tsx
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
} from "@mui/material";
import { Household, Location } from "../../types";
import { RootState } from "../../store";
import { householdsActions } from "../../store/slices/householdsSlice";

interface HouseholdFormProps {
  isEdit?: boolean;
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentHousehold, loading, error } = useSelector(
    (state: RootState) => state.households
  );

  const [formData, setFormData] = useState<{
    name: string;
    location: Location;
  }>({
    name: "",
    location: {
      name: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(householdsActions.fetchHouseholdByIdRequest(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentHousehold) {
      setFormData({
        name: currentHousehold.name,
        location: { ...currentHousehold.location },
      });
    }
  }, [isEdit, currentHousehold]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === "name" ? value : Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && id) {
      dispatch(
        householdsActions.updateHouseholdRequest({
          id,
          data: formData,
        })
      );
    } else {
      dispatch(householdsActions.createHouseholdRequest(formData));
    }

    navigate("/households");
  };

  if (isEdit && loading && !currentHousehold) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Household" : "Create New Household"}
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            label="Household Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            label="Location Name"
            name="location.name"
            value={formData.location.name}
            onChange={handleChange}
            helperText="e.g., Home, Office, Vacation House"
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Latitude"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleChange}
            inputProps={{
              step: 0.000001,
            }}
          />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            required
            fullWidth
            type="number"
            label="Longitude"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleChange}
            inputProps={{
              step: 0.000001,
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/households")}
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

export default HouseholdForm;
