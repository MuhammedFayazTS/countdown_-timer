import Timer from "../models/timer.model.js";

const getShop = (req, res) => res.locals.shopify.session.shop;

export async function getTimers(req, res) {
  const shop = getShop(req, res);
  const { search = "", sort = "asc", shouldHideExpired = false } = req.query;
  const searchStr = typeof search === "string" ? search.trim() : "";
  try {
    const filter = { shop };
    const sortDirection = sort === "desc" ? -1 : 1;
    if (searchStr) {
      filter.title = { $regex: searchStr, $options: "i" };
    }
    if (shouldHideExpired) {
      filter.endDate = { $gte: new Date() };
    }
    const timers = await Timer.find(filter).sort({ endDate: sortDirection });
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
