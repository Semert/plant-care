import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";

interface HealthStats {
  total: number;
  good: number;
  warning: number;
  critical: number;
  unknown: number;
}

interface HealthOverviewProps {
  stats: HealthStats;
}

const HealthOverview: React.FC<HealthOverviewProps> = ({ stats }) => {
  // Calculate percentages
  const goodPercent = (stats.good / stats.total) * 100 || 0;
  const warningPercent = (stats.warning / stats.total) * 100 || 0;
  const criticalPercent = (stats.critical / stats.total) * 100 || 0;
  const unknownPercent = (stats.unknown / stats.total) * 100 || 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Plant Health Overview
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid sx={{ xs: 12 }}>
            <Box mb={1} display="flex" justifyContent="space-between">
              <Typography variant="body2" color="success.main">
                Good
              </Typography>
              <Typography variant="body2">
                {stats.good} plants ({goodPercent.toFixed(0)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={goodPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "success.main",
                },
                mb: 2,
              }}
            />
          </Grid>

          <Grid sx={{ xs: 12 }}>
            <Box mb={1} display="flex" justifyContent="space-between">
              <Typography variant="body2" color="warning.main">
                Warning
              </Typography>
              <Typography variant="body2">
                {stats.warning} plants ({warningPercent.toFixed(0)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={warningPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255, 152, 0, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "warning.main",
                },
                mb: 2,
              }}
            />
          </Grid>

          <Grid sx={{ xs: 12 }}>
            <Box mb={1} display="flex" justifyContent="space-between">
              <Typography variant="body2" color="error.main">
                Critical
              </Typography>
              <Typography variant="body2">
                {stats.critical} plants ({criticalPercent.toFixed(0)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={criticalPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(244, 67, 54, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "error.main",
                },
                mb: 2,
              }}
            />
          </Grid>

          {stats.unknown > 0 && (
            <Grid sx={{ xs: 12 }}>
              <Box mb={1} display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Unknown
                </Typography>
                <Typography variant="body2">
                  {stats.unknown} plants ({unknownPercent.toFixed(0)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={unknownPercent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "grey.500",
                  },
                  mb: 2,
                }}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HealthOverview;
