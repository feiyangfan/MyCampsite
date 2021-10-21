import mongoose from "mongoose";

// const SiteLocationSchema = mongoose.Schema({
//   latitude: { type: Number, required: true },
//   longitude: { type: Number, required: true },
//   radius: { type: Number, default: 200 },
// });

export const SiteSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: Object, required: true }, // Can type be SiteLocationSchema?
});

export default mongoose.model("Site", SiteSchema);
