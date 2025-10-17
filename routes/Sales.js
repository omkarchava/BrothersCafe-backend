import express from "express";
import DailySales from "../models/DailySales.js";

const router = express.Router();

// Daywise sales
router.get("/daywise", async (req, res) => {
  try {
    const sales = await DailySales.find().sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
