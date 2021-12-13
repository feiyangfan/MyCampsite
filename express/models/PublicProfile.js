import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: {unique: true, type: String, required: true},
    displayName: {type: String},
    profilePicURL: {type: String},
    creationDate: {type: Date, required: true, default: Date.now}
});
const Model = mongoose.model("PublicProfile", schema);
export default Model;
