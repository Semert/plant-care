import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db";

import householdRoutes from "./routes/householdRoutes";
import plantRoutes from "./routes/plantRoutes";
import plantHealthRoutes from "./routes/plantHealthRoutes";

import { notFound, errorHandler } from "./middleware/errorMiddleware";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

app.use(
  cors({
    origin: "*", // or set to specific origin like "http://localhost:3000"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Plant Care API is running" });
});

app.use("/api/households", householdRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/health", plantHealthRoutes);

app.use(notFound);
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
app.listen(5001, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
