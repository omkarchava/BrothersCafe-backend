import express from "express";
import Bill from "../models/Bill.js";
import TotalSales from "../models/TotalSales.js";

const router = express.Router();

// ➤ Add a backdated bill
router.post("/backdated", async (req, res) => {
  try {
    const { items, total, date } = req.body;
    if (!items || !total || !date)
      return res.status(400).json({ message: "Missing required fields" });

    // Save the backdated bill
    const bill = new Bill({
      items,
      total,
      createdAt: new Date(date),
    });
    await bill.save();

    // Update total sales for that date
    const saleDate = new Date(date).toISOString().slice(0, 10);
    let record = await TotalSales.findOne({ date: saleDate });

    if (record) {
      record.totalSales += total;
      await record.save();
    } else {
      await TotalSales.create({ date: saleDate, totalSales: total });
    }

    res.json({ message: "✅ Backdated bill added successfully" });
  } catch (err) {
    console.error("Error saving backdated bill:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
