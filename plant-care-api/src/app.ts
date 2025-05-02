import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Define Routes (will add these later)
// app.use('/api/households', require('./routes/householdRoutes'));
// app.use('/api/plants', require('./routes/plantRoutes'));
// app.use('/api/health', require('./routes/healthRoutes'));

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Plant Care API is running" });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
