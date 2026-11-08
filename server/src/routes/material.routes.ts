import { Router } from "express";
import auth from "../middleware/auth";
import role from "../middleware/role";
import upload from "../middleware/upload";
import {
  createMaterial,
  getMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  regeneratePhrases
} from "../controllers/material.controller";

const router = Router();

router.post("/", auth, role("Doctor"), upload.single("file"), createMaterial );
router.get("/", auth, getMaterial);
router.get("/:id", auth, getMaterialById);
router.put("/:id", auth, role("Doctor"), updateMaterial);
router.delete("/:id", auth, role("admin", "Doctor"), deleteMaterial);
router.post('/:id/generate-phrases', auth, role('Doctor'), regeneratePhrases);

export default router;