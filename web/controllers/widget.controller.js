import Timer from "../models/timer.model.js";

/**
 * Normalize shop query param (e.g. "myshop.myshopify.com" or "https://myshop.myshopify.com").
 */
function normalizeShop(shop) {
  if (typeof shop !== "string") return null;
  const trimmed = shop.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^https?:\/\//, "").split("/")[0];
}

/**
 * Serialize timer document for widget (storefront). Returns plain object with
 * displayOptions, urgencySettings, and ISO date strings for client countdown.
 */
function toWidgetTimer(doc) {
  if (!doc) return null;
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    _id: d._id?.toString(),
    title: d.title,
    description: d.description,
    startDate: d.startDate instanceof Date ? d.startDate.toISOString() : d.startDate,
    endDate: d.endDate instanceof Date ? d.endDate.toISOString() : d.endDate,
    isActive: d.isActive,
    displayOptions: d.displayOptions || {
      backgroundColor: "#FF0000",
      textColor: "#FFFFFF",
      fontSize: "16px",
      position: "inline",
    },
    urgencySettings: d.urgencySettings || {
      enabled: true,
      triggerMinutes: 5,
      type: "notification_banner",
      message: "Hurry! Offer expires soon!",
    },
  };
}

export async function getActiveTimer(req, res) {
  const rawShop = req.query.shop;
  const shop = normalizeShop(rawShop);
  if (!shop) {
    return res.status(400).json({ error: "Missing or invalid shop parameter" });
  }

  try {
    const now = new Date();
    const timer = await Timer.findOne({
      shop,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    return res.json({ timer: toWidgetTimer(timer) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getActiveTimers(req, res) {
  const rawShop = req.query.shop;
  const limit = req.query.limit ? parseInt(req.query.limit, 25) : 0;
  const shop = normalizeShop(rawShop);
  if (!shop) {
    return res.status(400).json({ error: "Missing or invalid shop parameter" });
  }

  try {
    const now = new Date();
    let query = Timer.find({
      shop,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (limit > 0) {
      query = query.limit(limit);
    }

    const timers = await query;

    return res.json({ timers: timers.map(toWidgetTimer) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getTimerByIdForStore(req, res) {
  const { id } = req.params;
  const rawShop = req.query.shop;
  const shop = normalizeShop(rawShop);
  if (!shop) {
    return res.status(400).json({ error: "Missing or invalid shop parameter" });
  }
  if (!id) {
    return res.status(400).json({ error: "Missing timer id" });
  }

  try {
    const now = new Date();
    const timer = await Timer.findOne({
      _id: id,
      shop,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!timer) {
      return res.status(404).json({ error: "Timer not found or not active" });
    }
    return res.json({ timer: toWidgetTimer(timer) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
