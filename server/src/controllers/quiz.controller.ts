import { Request, Response, NextFunction } from "express";
import Quiz from "../models/Quiz";
import Material from "../models/Material";
import QuizAttempt from "../models/QuizAttempt";
import { generateQuiz } from "../services/aiGenerator.service";
import { getStudentStats, getQuizLeaderboard} from "../services/stats.service";

interface AttemptBody {
  answers: { questionId: string, selected: string}[];
}

export async function generateFromMaterial(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    console.log("Generating quiz from material ID:", req.params.materialId);
    const material = await Material.findById(req.params.materialId);
    if (!material) {
      res.status(404).json({ message: 'Material not found' });
      return;
    }

    const questions = await generateQuiz(material.content || '');
    const quiz = await Quiz.create({
      title: `Quiz - ${material.title}`,
      material: material._id,
      createdBy: req.user!._id,
      questions,
      generatedByAI: true,
    });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function createQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, material, questions } = req.body as {
      title?: string;
      material?: string;
      questions?: { question: string; options: string[]; correctAnswer: string }[];
    };

    if (!title || !material || !Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({
        message: 'title, material, and a non-empty questions array are required',
      });
      return;
    }

    const materialDoc = await Material.findById(material);
    if (!materialDoc) {
      res.status(400).json({ message: 'material does not reference an existing Material' });
      return;
    }

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) {
        res.status(400).json({
          message: 'Each question needs "question", at least 2 "options", and "correctAnswer"',
        });
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        res.status(400).json({
          message: `correctAnswer "${q.correctAnswer}" must be one of the provided options`,
        });
        return;
      }
    }

    const quiz = await Quiz.create({
      title,
      material,
      questions,
      createdBy: req.user!._id,
      generatedByAI: false, // manual creation is never AI-flagged, regardless of what body sends
    });

    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function getQuizzes(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const quizzes = await Quiz.find().populate("material", "title");
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
}

export async function getQuizById(req: Request, res: Response, next: NextFunction): Promise <void> {
  try { 
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ message: "Quiz Not Found"});
    }
    res.json(quiz);
  } catch(error) {
    next(error);
  }
}

export async function updateQuiz(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch(error) {
    next(error);
  }
}

export async function deleteQuiz(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch(error) {
    next(error);
  }
}

export async function attemptQuiz(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    const {answers} = req.body as AttemptBody;

    let score = 0;
    quiz.questions.forEach((q) => {
      const given = answers.find((a) => a.questionId === String(q._id));
      if (given && given.selected === q.correctAnswer) score++;
    });

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      patient: req.user!._id,
      answers,
      score,
      total: quiz.questions.length
    });
    res.status(201).json(attempt);
  } catch(error) {
    next(error);
  }
}

export async function getMyQuizStats(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const stats = await getStudentStats(req.user!._id);
    res.json(stats.quizAttempts);
  } catch(error) {
    next(error);
  }
}

export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const leaderboard = await getQuizLeaderboard();
    res.json(leaderboard);
  } catch(error) {
    next(error);
  }
}

