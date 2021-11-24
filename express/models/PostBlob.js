import mongoose from "mongoose";

const schema = new mongoose.Schema({
    profile: {type: mongoose.Schema.Types.ObjectId, ref: "PublicProfile", required: true},
    file: {type: String, required: true},
    signedURL: {type: String, required: true}
});
const Model = mongoose.model("PostBlob", schema);
export default Model;
