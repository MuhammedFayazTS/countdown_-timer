import z from "zod";
import Timer from "../models/timer.model.js";
import { timerSchema, timerUpdateSchema } from "../validators/timer.schema.js";

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
    const parsed = timerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: z.treeifyError(parsed.error),
      });
    }

    const data = parsed.data;

    const startDate = new Date(
      `${data.startDate.split("T")[0]}T${data.startTime || "00:00"}`,
    );

    const endDate = new Date(
      `${data.endDate.split("T")[0]}T${data.endTime || "00:00"}`,
    );

    const timer = new Timer({
      shop,
      title: data.title,
      description: data.description,
      startDate,
      endDate,
      displayOptions: data.displayOptions,
      urgencySettings: data.urgencySettings,
    });
    await timer.save();
    res.status(201).json({ timer, message: "Timer created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTimer(req, res) {
  const shop = getShop(req, res);
  try {
    const parsed = timerUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: z.treeifyError(parsed.error),
      });
    }

    const data = parsed.data;

    if (data.startDate || data.startTime) {
      const startDay = data.startDate ? data.startDate.split("T")[0] : "";
      data.startDate = new Date(`${startDay}T${data.startTime || "00:00"}`);
    }

    if (data.endDate || data.endTime) {
      const endDay = data.endDate ? data.endDate.split("T")[0] : "";
      data.endDate = new Date(`${endDay}T${data.endTime || "00:00"}`);
    }

    const timer = await Timer.findOneAndUpdate(
      { _id: req.params.id, shop },
      data,
      { new: true },
    );
    if (!timer) return res.status(404).json({ error: "Timer not found" });
    res.json({ timer, message: "Timer updated successfully" });
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
