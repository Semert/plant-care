import mongoose, { Schema, Document } from "mongoose";
import { Household } from "../types";

const LocationSchema: Schema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the main Household schema
const HouseholdSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the Household model
export default mongoose.model<Household & Document>(
  "Household",
  HouseholdSchema
);
