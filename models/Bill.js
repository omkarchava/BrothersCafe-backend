import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  total: {
    type: Number,
    required: true,
  },

  billedBy: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Bill", BillSchema);