import Timer from "../models/timer.model.js";

export const getActiveTimer = async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).json({ error: "Missing shop parameter" });

  try {
    const now = new Date();
    const timer = await Timer.findOne({
      shop,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    res.json({ timer: timer || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
