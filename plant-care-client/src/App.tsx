import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { store } from "./store";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AlertMessage from "./components/ui/AlertMessage";
import Dashboard from "./pages/Dashboard";
import HouseholdsPage from "./pages/HouseholdsPage";
import HouseholdFormPage from "./pages/HouseholdFormPage";
import PlantsPage from "./pages/PlantsPage";
import PlantFormPage from "./pages/PlantFormPage";
import PlantDetailsPage from "./pages/PlantDetailsPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green shade for plant theme
    },
    secondary: {
      main: "#81c784", // Lighter green
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <Header />
            <AlertMessage />
            <Routes>
              <Route path="/" element={<Dashboard />} />

              {/* Household Routes */}
              <Route path="/households" element={<HouseholdsPage />} />
              <Route path="/households/new" element={<HouseholdFormPage />} />
              <Route
                path="/households/edit/:id"
                element={<HouseholdFormPage />}
              />

              {/* Plant Routes */}
              <Route path="/plants" element={<PlantsPage />} />
              <Route path="/plants/new" element={<PlantFormPage />} />
              <Route path="/plants/edit/:id" element={<PlantFormPage />} />
              <Route path="/plants/:id" element={<PlantDetailsPage />} />
            </Routes>
            <Footer />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
