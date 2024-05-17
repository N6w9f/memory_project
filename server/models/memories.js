import mongoose from "mongoose";

const memoriesSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    creatorEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], required: true },
    likes: [String],
    comments: [Object],
    updated_at: Date,
    created_at: Date,
});

const Memories = mongoose.model("memories", memoriesSchema);
export default Memories;
