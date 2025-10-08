import express from "express";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || typeof price !== 'number') return res.status(400).json({ message: "Invalid data" });
    const item = await MenuItem.findOne({ name });
    if (item) {
      item.price = price;
      await item.save();
      return res.json({ message: "Menu item updated" });
    }
    const newItem = new MenuItem({ name, price });
    await newItem.save();
    res.json({ message: "Menu item added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
