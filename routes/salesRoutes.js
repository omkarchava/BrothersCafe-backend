import express from "express";
import SalesSummary from "../models/SalesSummary.js";

const router = express.Router();

// Get daywise sales summary
router.get("/daywise", async (req, res) => {
  try {
    const all = await SalesSummary.find().sort({ date: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
