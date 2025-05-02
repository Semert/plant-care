import mongoose, { Schema, Document } from "mongoose";
import { PlantHealth } from "../types";

const PlantHealthSchema: Schema = new Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  actualRainfall: {
    type: Number,
    required: true,
    min: 0,
  },
  actualHumidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  healthScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

export default mongoose.model<PlantHealth & Document>(
  "PlantHealth",
  PlantHealthSchema
);
