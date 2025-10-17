import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD for backdated bills
}, { timestamps: true });

export default mongoose.model("Bill", BillSchema);
