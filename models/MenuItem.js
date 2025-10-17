import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
