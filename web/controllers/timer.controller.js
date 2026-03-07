import Timer from "../models/timer.model.js";

const getShop = (req, res) => res.locals.shopify.session.shop;

export async function getTimers(req, res) {
  const shop = getShop(req, res);
  const { search = "" } = req.query;
  const searchStr = typeof search === "string" ? search.trim() : "";
  try {
    const filter = { shop };
    if (searchStr) {
      filter.title = { $regex: searchStr, $options: "i" };
    }
    const timers = await Timer.find(filter).sort({ createdAt: -1 });
    res.json({ timers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTimerById(req, res) {
  const shop = getShop(req, res);
  try {
    const timer = await Timer.findOne({ _id: req.params.id, shop });
    if (!timer) return res.status(404).json({ error: "Timer not found" });
    res.json({ timer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTimer(req, res) {
  const shop = getShop(req, res);
  try {
    const timer = new Timer({ ...req.body, shop });
    await timer.save();
    res.status(201).json({ timer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTimer(req, res) {
  const shop = getShop(req, res);
  try {
    const timer = await Timer.findOneAndUpdate(
      { _id: req.params.id, shop },
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!timer) return res.status(404).json({ error: "Timer not found" });
    res.json({ timer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteTimer(req, res) {
  const shop = getShop(req, res);
  try {
    const timer = await Timer.findOneAndDelete({ _id: req.params.id, shop });
    if (!timer) return res.status(404).json({ error: "Timer not found" });
    res.json({ message: "Timer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
