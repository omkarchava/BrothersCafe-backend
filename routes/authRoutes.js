import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 8);
    await User.create({ username, password: hashed });
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
  localStorage.removeItem("token"); 
  window.location.href = "/login";
});

export default router;
