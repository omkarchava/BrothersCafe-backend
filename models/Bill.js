import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bill", BillSchema);
