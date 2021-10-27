import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: {unique: true, type: String, required: true},
    displayName: {type: String},
    profilePicKey: {type: String},
    creationDate: {type: Date, required: true, default: Date.now}
});
const Model = mongoose.model("Profile", schema);
export default Model;
