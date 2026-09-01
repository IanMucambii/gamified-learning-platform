import { Router } from "express";
import auth from "../middleware/auth";
import role from "../middleware/role";
import { getAdminDashboardHandler, getPatients, getCaregivers } from "../controllers/admin.controller";

const router = Router();

router.get('/dashboard', auth, role('admin'), getAdminDashboardHandler);
router.get("/patients", auth, role("admin"), getPatients);
router.get("/caregivers", auth, role("admin"), getCaregivers);

export default router;