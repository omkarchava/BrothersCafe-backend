import express from "express";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const menu = await MenuItem.find().sort({ name: 1 });
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// POST add new item
router.post("/add", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price == null || isNaN(price)) {
      return res.status(400).json({ message: "Invalid name or price" });
    }

    const existingItem = await MenuItem.findOne({ name });
    if (existingItem) {
      existingItem.price = price;
      await existingItem.save();
      return res.json({ message: "Menu item updated" });
    }

    const newItem = new MenuItem({ name, price });
    await newItem.save();
    res.json({ message: "Menu item added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding menu item" });
  }
});

// PUT update item by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || price == null || isNaN(price)) {
      return res.status(400).json({ message: "Invalid name or price" });
    }

    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = name;
    item.price = price;
    await item.save();
    res.json({ message: "Menu item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating menu item" });
  }
});

// DELETE item by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

export default router;
