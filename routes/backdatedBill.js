import express from "express";
import Bill from "../models/Bill.js";
import DailySales from "../models/DailySales.js";

const router = express.Router();

// Add backdated bill
router.post("/new", async (req, res) => {
  try {
    const { items, total, date } = req.body;

    if (!items || !total || !date) {
      return res.status(400).json({ message: "Items, total, and date are required" });
    }

    // 1️⃣ Save bill
    const bill = new Bill({ items, total, date });
    await bill.save();

    // 2️⃣ Update daily sales
    const daily = await DailySales.findOne({ date });
    if (daily) {
      daily.totalSales += total;
      await daily.save();
    } else {
      await DailySales.create({ date, totalSales: total });
    }

    res.json({ message: "Backdated bill saved successfully!", bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all backdated bills
router.get("/all", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete backdated bill
router.delete("/delete/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // Update daily sales
    const daily = await DailySales.findOne({ date: bill.date });
    if (daily) {
      daily.totalSales -= bill.total;
      if (daily.totalSales < 0) daily.totalSales = 0;
      await daily.save();
    }

    await bill.remove();
    res.json({ message: "Backdated bill deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
