import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{ mt: "auto", py: 3, bgcolor: "background.paper" }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          Plant Care App &copy; {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
