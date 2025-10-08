import express from "express";
import Bill from "../models/Bill.js";
import SalesSummary from "../models/SalesSummary.js";

const router = express.Router();

// helper to get date string YYYY-MM-DD from Date or now
const getDateStr = (d = new Date()) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

// Save new bill and update sales summary
router.post("/new", async (req, res) => {
  try {
    const { items, total, createdAt } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Empty cart" });
    const bill = new Bill({ items, total, createdAt: createdAt ? new Date(createdAt) : undefined });
    await bill.save();

    const dateStr = getDateStr(bill.createdAt);
    const existing = await SalesSummary.findOne({ date: dateStr });
    if (existing) {
      existing.totalSales += total;
      await existing.save();
    } else {
      const s = new SalesSummary({ date: dateStr, totalSales: total });
      await s.save();
    }

    res.json({ message: "Bill saved and sales summary updated" });
  } catch (err) {
    console.error("Error saving bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all bills
router.get("/all", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a bill and update sales summary
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const dateStr = getDateStr(bill.createdAt);
    const existing = await SalesSummary.findOne({ date: dateStr });
    if (existing) {
      existing.totalSales -= bill.total;
      if (existing.totalSales <= 0) {
        await SalesSummary.deleteOne({ _id: existing._id });
      } else {
        await existing.save();
      }
    }

    await Bill.deleteOne({ _id: id });
    res.json({ message: "Bill deleted and sales summary updated" });
  } catch (err) {
    console.error("Error deleting bill:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
