import express from "express";
import {
  createDisaster,
  deleteDisaster,
  getDisasters,
  updateDisaster,
} from "../controllers/disastersController.js";
import { getSocialMediaPosts } from "../controllers/socialMediaController.js";
import {
  getResourcesNearby,
  createResource,
} from "../controllers/resourceController.js";
import { getOfficialUpdates } from "../controllers/updatesController.js";
import { verifyImage } from "../controllers/verificationController.js";
import { requireRole } from "../middleware/requireRole.js";
import { getReports, createReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createDisaster);
router.get("/", getDisasters);
router.put("/:id", requireRole(["admin"]), updateDisaster);
router.delete("/:id", requireRole(["admin"]), deleteDisaster);

router.get("/:id/social-media", getSocialMediaPosts);

router.get("/:id/reports", getReports);
router.post("/:id/reports", createReport);

router.get("/:id/resources", getResourcesNearby);
router.post("/:id/resources", createResource);

router.get("/:id/official-updates", getOfficialUpdates);
router.post("/:id/verify-image", verifyImage);

export default router;
