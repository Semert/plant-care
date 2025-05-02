import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { RootState } from "../store";
import { householdsActions } from "../store/slices/householdsSlice";
import { plantsActions } from "../store/slices/plantsSlice";
import { healthActions } from "../store/slices/healthSlice";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items: households, loading: householdsLoading } = useSelector(
    (state: RootState) => state.households
  );
  const { items: plants, loading: plantsLoading } = useSelector(
    (state: RootState) => state.plants
  );
  const { records, loading: healthLoading } = useSelector(
    (state: RootState) => state.health
  );

  useEffect(() => {
    dispatch(householdsActions.fetchHouseholdsRequest());
    dispatch(plantsActions.fetchPlantsRequest());

    // For each plant, fetch its health records
    if (plants.length > 0) {
      plants.forEach((plant) => {
        dispatch(healthActions.fetchPlantHealthRequest(plant.id));
      });
    }
  }, [dispatch, plants.length]);

  const handleUpdateAllHealth = () => {
    dispatch(healthActions.updateAllPlantsHealthRequest());
  };

  // Find plants with critical health scores (below 50)
  const plantsWithHealth = plants.map((plant) => {
    const healthRecords = records[plant.id] || [];
    const latestRecord = healthRecords[0]; // Assuming records are sorted by date (newest first)

    return {
      ...plant,
      healthScore: latestRecord?.healthScore || null,
      healthStatus: latestRecord?.healthScore
        ? latestRecord.healthScore < 50
          ? "critical"
          : latestRecord.healthScore < 75
          ? "warning"
          : "good"
        : null,
    };
  });

  const criticalPlants = plantsWithHealth.filter(
    (plant) => plant.healthStatus === "critical"
  );
  const warningPlants = plantsWithHealth.filter(
    (plant) => plant.healthStatus === "warning"
  );

  const loading = householdsLoading || plantsLoading || healthLoading;

  return (
    <PageContainer title="Plant Care Dashboard">
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Households
                </Typography>
                <Typography variant="h3">{households.length}</Typography>
                <Button component={RouterLink} to="/households" sx={{ mt: 2 }}>
                  View All
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid sx={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plants
                </Typography>
                <Typography variant="h3">{plants.length}</Typography>
                <Button component={RouterLink} to="/plants" sx={{ mt: 2 }}>
                  View All
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid sx={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plants Needing Attention
                </Typography>
                <Typography variant="h3">
                  {criticalPlants.length + warningPlants.length}
                </Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateAllHealth}
                  sx={{ mt: 2 }}
                >
                  Update All Health
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Plants Needing Attention */}
          <Grid sx={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plants Needing Attention
                </Typography>

                {criticalPlants.length === 0 && warningPlants.length === 0 ? (
                  <Typography>All plants are healthy!</Typography>
                ) : (
                  <List>
                    {criticalPlants.map((plant) => (
                      <React.Fragment key={plant.id}>
                        <ListItem
                          component={RouterLink}
                          to={`/plants/${plant.id}`}
                        >
                          <ListItemText
                            primary={plant.name}
                            secondary={`Health Score: ${plant.healthScore}% (Critical)`}
                            primaryTypographyProps={{ color: "error" }}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}

                    {warningPlants.map((plant) => (
                      <React.Fragment key={plant.id}>
                        <ListItem
                          component={RouterLink}
                          to={`/plants/${plant.id}`}
                        >
                          <ListItemText
                            primary={plant.name}
                            secondary={`Health Score: ${plant.healthScore}% (Warning)`}
                            primaryTypographyProps={{ color: "warning.main" }}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Health Updates */}

          <Grid sx={{ xs: 12 }}>
            {" "}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Health Updates
                </Typography>

                {Object.values(records)
                  .flat()
                  .filter((record) => record.healthScore != null).length ===
                0 ? (
                  <Typography>No recent health updates.</Typography>
                ) : (
                  <List>
                    {Array.from(
                      new Map(
                        Object.values(records)
                          .flat()
                          .filter((record) => record.healthScore !== 0) // Only include records with health scores
                          .map((record) => [record.id, record])
                      ).values()
                    )
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 5)
                      .map((record) => {
                        const plant = plants.find(
                          (p) => p.id === record.plantId
                        );

                        return (
                          <ListItem
                            key={record.id}
                            component={RouterLink}
                            to={`/plants/${record.plantId}`}
                          >
                            <ListItemText
                              primary={plant?.name || "Unknown Plant"}
                              secondary={`Health Score: ${Math.round(
                                record.healthScore
                              )}% | ${new Date(
                                record.date
                              ).toLocaleDateString()}`}
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default Dashboard;
