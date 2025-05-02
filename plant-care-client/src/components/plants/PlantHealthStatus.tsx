import React from "react";
import { Box, Typography, CircularProgress, Tooltip } from "@mui/material";

interface PlantHealthStatusProps {
  healthScore: number | null;
  size?: "small" | "medium" | "large";
}

const PlantHealthStatus: React.FC<PlantHealthStatusProps> = ({
  healthScore,
  size = "medium",
}) => {
  if (healthScore === null) {
    return (
      <Box display="flex" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          No data
        </Typography>
      </Box>
    );
  }

  // Determine color based on health score
  let color = "#4caf50"; // Green (good)
  let status = "Good";

  if (healthScore < 50) {
    color = "#f44336"; // Red (critical)
    status = "Critical";
  } else if (healthScore < 75) {
    color = "#ff9800"; // Orange (warning)
    status = "Warning";
  }

  // Determine size
  const dimensions = size === "small" ? 40 : size === "large" ? 80 : 60;

  const thickness = size === "small" ? 4 : size === "large" ? 8 : 6;

  const fontSize =
    size === "small" ? "0.875rem" : size === "large" ? "1.5rem" : "1.125rem";

  return (
    <Tooltip title={`Health Status: ${status}`}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={100}
          size={dimensions}
          thickness={thickness}
          sx={{ color: "rgba(0, 0, 0, 0.12)" }}
        />
        <CircularProgress
          variant="determinate"
          value={healthScore}
          size={dimensions}
          thickness={thickness}
          sx={{
            color: color,
            position: "absolute",
            left: 0,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            fontSize={fontSize}
            fontWeight="bold"
          >
            {`${Math.round(healthScore)}%`}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default PlantHealthStatus;
