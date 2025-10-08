import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number
}, { _id: false });

const billSchema = new mongoose.Schema({
  items: [itemSchema],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bill", billSchema);
