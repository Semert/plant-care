import React, { useEffect, useState } from "react";
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
  useTheme,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  LocalFlorist as PlantIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import PageContainer from "../components/layout/PageContainer";
import { RootState } from "../store";
import { householdsActions } from "../store/slices/householdsSlice";
import { plantsActions } from "../store/slices/plantsSlice";
import { healthActions } from "../store/slices/healthSlice";

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

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
    setIsUpdating(true);
    dispatch(healthActions.updateAllPlantsHealthRequest());

    // Reset updating state after a short delay
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
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
  const goodPlants = plantsWithHealth.filter(
    (plant) => plant.healthStatus === "good"
  );

  // Calculate health statistics
  const totalPlantsWithHealth =
    criticalPlants.length + warningPlants.length + goodPlants.length;
  const criticalPercentage =
    totalPlantsWithHealth > 0
      ? (criticalPlants.length / totalPlantsWithHealth) * 100
      : 0;
  const warningPercentage =
    totalPlantsWithHealth > 0
      ? (warningPlants.length / totalPlantsWithHealth) * 100
      : 0;
  const goodPercentage =
    totalPlantsWithHealth > 0
      ? (goodPlants.length / totalPlantsWithHealth) * 100
      : 0;

  const loading = householdsLoading || plantsLoading || healthLoading;

  return (
    <PageContainer title="Plant Care Dashboard">
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
          <Grid container spacing={6}>
            {/* Summary Cards */}
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minWidth: "250px",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <HomeIcon
                      sx={{ color: theme.palette.primary.main, mr: 1 }}
                    />
                    <Typography variant="h6">Households</Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      my: 2,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {households.length}
                  </Typography>
                  <Box mt="auto">
                    <Button
                      fullWidth
                      variant="outlined"
                      component={RouterLink}
                      to="/households"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View All
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    minWidth: "250px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <PlantIcon
                      sx={{ color: theme.palette.success.main, mr: 1 }}
                    />
                    <Typography variant="h6">Plants</Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      my: 2,
                      fontWeight: "bold",
                      color: theme.palette.success.main,
                    }}
                  >
                    {plants.length}
                  </Typography>
                  <Box mt="auto">
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      component={RouterLink}
                      to="/plants"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View All
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <WarningIcon
                      sx={{ color: theme.palette.warning.main, mr: 1 }}
                    />
                    <Typography variant="h6">Needs Attention</Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      my: 2,
                      fontWeight: "bold",
                      color:
                        criticalPlants.length > 0
                          ? theme.palette.error.main
                          : warningPlants.length > 0
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                    }}
                  >
                    {criticalPlants.length + warningPlants.length}
                  </Typography>
                  <Box mt="auto">
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      onClick={handleUpdateAllHealth}
                      disabled={isUpdating}
                      startIcon={<RefreshIcon />}
                    >
                      {isUpdating ? "Updating..." : "Update All Health"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                gap: 2,
              }}
            >
              {/* Health Overview */}
              <Grid sx={{ xs: 12, md: 6, width: "100%" }}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Health Overview
                    </Typography>

                    {totalPlantsWithHealth === 0 ? (
                      <Typography variant="body1">
                        No health data available yet.
                      </Typography>
                    ) : (
                      <>
                        <Box mb={3}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={1}
                          >
                            <Typography variant="body2" color="success.main">
                              Good ({goodPlants.length})
                            </Typography>
                            <Typography variant="body2">
                              {goodPercentage.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={goodPercentage}
                            color="success"
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>

                        <Box mb={3}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={1}
                          >
                            <Typography variant="body2" color="warning.main">
                              Warning ({warningPlants.length})
                            </Typography>
                            <Typography variant="body2">
                              {warningPercentage.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={warningPercentage}
                            color="warning"
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>

                        <Box mb={1}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={1}
                          >
                            <Typography variant="body2" color="error.main">
                              Critical ({criticalPlants.length})
                            </Typography>
                            <Typography variant="body2">
                              {criticalPercentage.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={criticalPercentage}
                            color="error"
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Box>

            {/* Recent Health Updates */}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                gap: 6,
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <Grid sx={{ xs: 12, md: 6, minWidth: "350px" }}>
                <Card elevation={3}>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">
                        Recent Health Updates
                      </Typography>
                      <Tooltip title="View all plants">
                        <IconButton
                          component={RouterLink}
                          to="/plants"
                          size="small"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {Object.values(records)
                      .flat()
                      .filter((record) => record.healthScore != null).length ===
                    0 ? (
                      <Box
                        p={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor={theme.palette.grey[50]}
                        borderRadius={1}
                      >
                        <Typography variant="body1" color="textSecondary">
                          No recent health updates. Click "Update All Health" to
                          get started.
                        </Typography>
                      </Box>
                    ) : (
                      <List sx={{ maxHeight: "300px", overflow: "auto" }}>
                        {Array.from(
                          new Map(
                            Object.values(records)
                              .flat()
                              .filter((record) => record.healthScore != null)
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

                            // Determine color based on health score
                            let healthColor = "success.main";
                            if (record.healthScore < 50) {
                              healthColor = "error.main";
                            } else if (record.healthScore < 75) {
                              healthColor = "warning.main";
                            }

                            return (
                              <React.Fragment key={record.id}>
                                <ListItem
                                  component={RouterLink}
                                  to={`/plants/${record.plantId}`}
                                  sx={{
                                    borderLeft: `4px solid ${
                                      // @ts-ignore
                                      theme.palette[healthColor.split(".")[0]][
                                        healthColor.split(".")[1]
                                      ]
                                    }`,
                                    my: 0.5,
                                    borderRadius: 1,
                                    bgcolor: theme.palette.background.paper,
                                    "&:hover": {
                                      bgcolor: theme.palette.action.hover,
                                    },
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight="medium"
                                      >
                                        {plant?.name || "Unknown Plant"}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          component="span"
                                          color={healthColor}
                                        >
                                          Health:{" "}
                                          {Math.round(record.healthScore)}%
                                        </Typography>
                                        {" • "}
                                        <Typography
                                          variant="body2"
                                          component="span"
                                          color="text.secondary"
                                        >
                                          {new Date(
                                            record.date
                                          ).toLocaleDateString()}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              </React.Fragment>
                            );
                          })}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Plants Needing Attention */}
              <Grid sx={{ xs: 12 }}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Plants Needing Attention
                    </Typography>

                    {criticalPlants.length === 0 &&
                    warningPlants.length === 0 ? (
                      <Box
                        p={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor={theme.palette.success.light}
                        borderRadius={1}
                      >
                        <Typography variant="h6" color="success.dark">
                          All plants are healthy!
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {criticalPlants.length > 0 && (
                          <Grid sx={{ xs: 12, lg: 6 }}>
                            <Typography
                              variant="subtitle1"
                              color="error"
                              gutterBottom
                              sx={{ fontWeight: "bold", mt: 2 }}
                            >
                              Critical
                            </Typography>
                            <Paper
                              variant="outlined"
                              sx={{ bgcolor: theme.palette.error.light, p: 1 }}
                            >
                              <List
                                sx={{ maxHeight: "300px", overflow: "auto" }}
                              >
                                {criticalPlants.map((plant) => (
                                  <ListItem
                                    key={plant.id}
                                    component={RouterLink}
                                    to={`/plants/${plant.id}`}
                                    sx={{
                                      bgcolor: theme.palette.background.paper,
                                      mb: 1,
                                      borderRadius: 1,
                                      "&:last-child": { mb: 0 },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="subtitle1"
                                          color="error.dark"
                                          fontWeight="medium"
                                        >
                                          {plant.name}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box display="flex" alignItems="center">
                                          <LinearProgress
                                            variant="determinate"
                                            value={plant.healthScore || 0}
                                            color="error"
                                            sx={{
                                              height: 6,
                                              borderRadius: 1,
                                              width: "100px",
                                              mr: 1,
                                            }}
                                          />
                                          <Typography variant="body2">
                                            {/* @ts-ignore */}
                                            {Math.round(plant.healthScore)}%
                                            Health
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </Grid>
                        )}

                        {warningPlants.length > 0 && (
                          <Grid
                            sx={{
                              xs: 12,
                              lg: criticalPlants.length > 0 ? 6 : 12,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              color="warning.dark"
                              gutterBottom
                              sx={{ fontWeight: "bold", mt: 2 }}
                            >
                              Warning
                            </Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                bgcolor: theme.palette.warning.light,
                                p: 1,
                              }}
                            >
                              <List
                                sx={{ maxHeight: "300px", overflow: "auto" }}
                              >
                                {warningPlants.map((plant) => (
                                  <ListItem
                                    key={plant.id}
                                    component={RouterLink}
                                    to={`/plants/${plant.id}`}
                                    sx={{
                                      bgcolor: theme.palette.background.paper,
                                      mb: 1,
                                      borderRadius: 1,
                                      "&:last-child": { mb: 0 },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="subtitle1"
                                          color="warning.dark"
                                          fontWeight="medium"
                                        >
                                          {plant.name}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box display="flex" alignItems="center">
                                          <LinearProgress
                                            variant="determinate"
                                            value={plant.healthScore || 0}
                                            color="warning"
                                            sx={{
                                              height: 6,
                                              borderRadius: 1,
                                              width: "100px",
                                              mr: 1,
                                            }}
                                          />
                                          <Typography variant="body2">
                                            {/* @ts-ignore */}
                                            {Math.round(plant.healthScore)}%
                                            Health
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Box>
          </Grid>
        </Box>
      )}
    </PageContainer>
  );
};

export default Dashboard;
