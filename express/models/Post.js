import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  siteId: {type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true},
  notes: {type: String, maxLength: 280},
  weatherTemp: {type: Number}, // in degrees celsius 
  weatherDesc: {type: String, enum: ['Clear', 'Cloudy', 'Rainy', 'Snowy', 'Atmosphere']},
  profile: {type: mongoose.Schema.Types.ObjectId, ref: "PublicProfile", required: true},
  file: {type: String, required: true},
  signedURL: {type: String},
  publicURL: {type: String}
}, {timestamps: true});

export default mongoose.model("Post", PostSchema);
