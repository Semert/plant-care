import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";

// Placeholder
const Home = () => <div>Plant Care App - Home Page</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green
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
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes later */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
