import express from "express";
import { getActiveTimer, getActiveTimers, getTimerByIdForStore } from "../controllers/widget.controller.js";

const router = express.Router();

/** Currently active timer for store (single)*/
router.get("/active", getActiveTimer);

// use if multiple timers to be displayed in store
/** Currently active multiple timers with limit */
router.get("/active/multiple", getActiveTimers);

router.get("/timer/:id", getTimerByIdForStore);

export default router;
