import { Router } from "express";
import auth from "../middleware/auth";
import role from "../middleware/role";
import { getUsers, approveDoctor, updateUser, deleteUser } from "../controllers/user.controller";

const router = Router();

router.get("/", auth, role("admin"), getUsers);
router.patch("/:id/approve", auth, role("admin"), approveDoctor);
router.put("/:id", auth, role("admin"), updateUser);
router.delete("/:id", auth, role("admin"), deleteUser);

export default router;