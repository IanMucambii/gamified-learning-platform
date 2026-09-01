import { Router } from "express";
import auth from "../middleware/auth";
import role from "../middleware/role";
import { getAdminDashboardHandler } from "../controllers/admin.controller";

const router = Router();

router.get('/dashboard', auth, role('admin'), getAdminDashboardHandler);

export default router;