import express from "express";
import Bill from "../models/Bill.js";

const router = express.Router();

// ✅ Daywise total sales aggregation
router.get("/daywise", async (req, res) => {
  try {
    const sales = await Bill.aggregate([
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: 1,
        },
      },
      {
        $group: {
          _id: "$date",
          totalSales: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } }, // sort by date descending (latest first)
    ]);

    const formatted = sales.map((s) => ({
      date: s._id,
      totalSales: s.totalSales,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching sales report:", err);
    res.status(500).json({ message: "Error generating sales report" });
  }
});

export default router;
