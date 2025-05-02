import mongoose, { Schema, Document } from "mongoose";
import { Plant } from "../types";

const PlantSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    weeklyWaterNeed: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedRelativeHumidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Plant & Document>("Plant", PlantSchema);
