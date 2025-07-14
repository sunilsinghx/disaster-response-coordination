import { geoCode } from "../controllers/geocodeController.js";
import express from "express";

const router = express.Router();

router.post("/", geoCode);

export default router;
