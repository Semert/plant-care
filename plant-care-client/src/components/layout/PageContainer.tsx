import React, { ReactNode } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box>{children}</Box>
      </Paper>
    </Container>
  );
};

export default PageContainer;
