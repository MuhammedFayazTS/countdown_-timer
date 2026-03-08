import express from "express";
import { getActiveTimer, getTimerById } from "../controllers/widget.controller.js";

const router = express.Router();

/** Currently active timer for store (single). ?shop=myshop.myshopify.com */
router.get("/active", getActiveTimer);

/** Specific timer by id (must be active). GET /api/widget/timer/:id?shop=... */
router.get("/timer/:id", getTimerById);

export default router;
