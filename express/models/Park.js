import mongoose from "mongoose";
import { SiteSchema } from "./Site.js";
// const ParkBoundarySchema = mongoose.Schema({
//   latitudeStart: { type: Number, required: true },
//   latitudeEnd: { type: Number, required: true },
//   longitudestart: { type: Number, required: true },
//   longitudeEnd: { type: Number, required: true },
// });

// const ParkLocationSchema = mongoose.Schema({
//   latitude: { type: Number, required: true },
//   longitude: { type: Number, required: true },
//   radius: { type: Number, default: -1 },
// });

const ParkSchema = mongoose.Schema({
  name: { type: String, required: true },
  boundary: { type: Object, required: true }, // Can type be BoundarySchema?
  location: { type: Object, required: true }, // Can type be LocationSchema?
  sites: { type: [SiteSchema], default: [] },
});

export default mongoose.model("Park", ParkSchema);
