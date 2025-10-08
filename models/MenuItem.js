import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});

export default mongoose.model("MenuItem", menuItemSchema);
