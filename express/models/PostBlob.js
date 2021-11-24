import mongoose from "mongoose";
import {PublicProfileSchema} from "./PublicProfile.js";

export const PostBlobSchema = new mongoose.Schema({
    profile: {type: PublicProfileSchema, required: true},
    file: {type: String, required: true},
    signedURL: {type: String, required: true}
});

const Model = mongoose.model("PostBlob", PostBlobSchema);
export default Model;
