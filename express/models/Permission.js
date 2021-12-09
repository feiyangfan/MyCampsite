import mongoose from "mongoose";

const schema = new mongoose.Schema({
    profile: {type: mongoose.Schema.Types.ObjectId, ref: "PublicProfile", required: true},
    admin: {type: Boolean, required: true}
}, {timestamps: true});
const Model = mongoose.model("Permission", schema);
export default Model;
