import mongoose from "mongoose";

const DailySalesSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  totalSales: { type: Number, default: 0 },
});

export default mongoose.model("DailySales", DailySalesSchema);
