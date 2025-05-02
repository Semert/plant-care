import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import PageContainer from "../components/layout/PageContainer";
import PlantHealthChart from "../components/plants/PlantHealthChart";
import { RootState } from "../store";
import { plantsActions } from "../store/slices/plantsSlice";
import { householdsActions } from "../store/slices/householdsSlice";
import { healthActions } from "../store/slices/healthSlice";

const PlantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { currentPlant, loading: plantLoading } = useSelector(
    (state: RootState) => state.plants
  );

  const { items: households, loading: householdsLoading } = useSelector(
    (state: RootState) => state.households
  );

  const { records, loading: healthLoading } = useSelector(
    (state: RootState) => state.health
  );

  useEffect(() => {
    if (id) {
      dispatch(plantsActions.fetchPlantByIdRequest(id));
      dispatch(householdsActions.fetchHouseholdsRequest());
      dispatch(healthActions.fetchPlantHealthRequest(id));
    }
  }, [dispatch, id]);

  const handleUpdateHealth = () => {
    if (id) {
      dispatch(healthActions.updatePlantHealthRequest(id));
    }
  };

  const loading = plantLoading || householdsLoading || healthLoading;

  if (loading && !currentPlant) {
    return (
      <PageContainer title="Plant Details">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!currentPlant) {
    return (
      <PageContainer title="Plant Details">
        <Typography color="error">Plant not found</Typography>
      </PageContainer>
    );
  }

  const household = households.find((h) => h.id === currentPlant.householdId);
  const healthRecords = records[id || ""] || [];
  const latestRecord = healthRecords[0]; // Assuming records are sorted by date (newest first)

  // Determine health status
  let healthStatus = "unknown";
  let healthColor = "default";

  if (latestRecord) {
    if (latestRecord.healthScore >= 75) {
      healthStatus = "Good";
      healthColor = "success";
    } else if (latestRecord.healthScore >= 50) {
      healthStatus = "Warning";
      healthColor = "warning";
    } else {
      healthStatus = "Critical";
      healthColor = "error";
    }
  }

  return (
    <PageContainer title={currentPlant.name}>
      <Grid container spacing={3}>
        {/* Plant Details */}
        <Grid sx={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plant Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {currentPlant.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Household:</strong> {household?.name || "Unknown"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong>{" "}
                {household?.location.name || "Unknown"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Weekly Water Need:</strong>{" "}
                {currentPlant.weeklyWaterNeed} mm
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Expected Humidity:</strong>{" "}
                {currentPlant.expectedRelativeHumidity}%
              </Typography>

              <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                <strong>Health Status:</strong>{" "}
                <Chip label={healthStatus} color={healthColor as any} />
              </Typography>

              {latestRecord && (
                <>
                  <Typography variant="body1" gutterBottom>
                    <strong>Health Score:</strong> {latestRecord.healthScore}%
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(latestRecord.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Recent Rainfall:</strong>{" "}
                    {latestRecord.actualRainfall} mm
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Recent Humidity:</strong>{" "}
                    {latestRecord.actualHumidity}%
                  </Typography>
                </>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateHealth}
                sx={{ mt: 2 }}
              >
                Update Health Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Plant Health Chart */}
        <Grid sx={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <PlantHealthChart plantId={id || ""} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default PlantDetailsPage;
