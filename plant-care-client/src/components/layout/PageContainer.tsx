import React, { ReactNode } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default PageContainer;
