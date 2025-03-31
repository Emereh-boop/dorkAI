import mongoose from "mongoose";

const DorkSchema = new mongoose.Schema({
  query: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

export const Dork = mongoose.model("Dork", DorkSchema);
