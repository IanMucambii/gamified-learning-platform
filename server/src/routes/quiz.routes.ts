import { Router } from "express";
import auth from "express";
import role from "../middleware/role";
import {
  generateFromMaterial,
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
  getMyQuizStats,
  getLeaderboard
} from "../controllers/quiz.controller"

const router = Router();

router.post("/generate/material:id", auth, role("Doctor"), generateFromMaterial);
router.post("/", auth, role("Patient"), createQuiz);
router.get("/", auth, getQuizzes);
router.get("/leaderboard", auth, getLeaderboard);
router.get("my-stats", auth, role("Patient"), getMyQuizStats);
router.get("/:id", auth, getQuizById);
router.put("/:id", auth, role("Doctor"), updateQuiz);
router.delete("/:id", auth, role("Doctor", "admin"), deleteQuiz);
router.post("/:id/attempt/", auth, role("Patient"), attemptQuiz);

export default router;

