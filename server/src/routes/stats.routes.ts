import { Router } from "express";
import auth from "../middleware/auth";
import role from "../middleware/role";
import { getMyOverallStats } from "../controllers/stats.controller";

const router = Router();
router.get("/me", auth, role("Patient"), getMyOverallStats);

export default router;