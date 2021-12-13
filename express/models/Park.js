import mongoose from "mongoose";
import { SiteSchema } from "./Site.js";

const ParkSchema = mongoose.Schema({
  name: { type: String, required: true },
  boundary: { type: Object, required: true },
  location: { type: Object, required: true },
  sites: { type: [SiteSchema], default: [] },
});

export default mongoose.model("Park", ParkSchema);
