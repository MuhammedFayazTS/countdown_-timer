import express from "express";
import { getActiveTimer } from "../controllers/widget.controller.js";

const router = express.Router();

router.get("/active", getActiveTimer);

export default router;
