import { Request, Response, NextFunction } from "express";
import Puzzle from "../models/Puzzle";
import Material from "../models/Material";
import PuzzleAttempt from "../models/PuzzleAttempt";
import { generatePuzzle } from "../services/aiGenerator.service";
import { getStudentStats, getPuzzleLeaderboard } from "../services/stats.service";
import { getPuzzleById as getPuzzleByIdService } from "../services/puzzle.service"; // adjust path

interface solveBody {
  correctPairs: number;
  totalPairs: number;
  timeTakenSec?: number;
}

export async function generateFromMaterial(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const material = await Material.findById(req.params.materialId);
    if (!material) {
      res.status(404).json({ message: "MaterialNotFound"});
      return;
    }

    const { puzzleType, pairs } = await generatePuzzle(material.content || '');
    const puzzle = await Puzzle.create({
      title: `Puzzle - ${material.title}`,
      material: material.id,
      createdBy: req.user!._id,
      puzzleType,
      pairs,
      generatedByAi: true,
    });
    res.status(201).json(puzzle);
  } catch(error) {
    next(error);
  }
}

export async function createPuzzle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, material, puzzleType, pairs } = req.body as {
      title?: string;
      material?: string;
      puzzleType?: string;
      pairs?: { left: string; right: string }[];
    };

    if (!title || !material || !Array.isArray(pairs) || pairs.length === 0) {
      res.status(400).json({
        message: 'title, material, and a non-empty pairs array are required',
      });
      return;
    }

    const materialDoc = await Material.findById(material);
    if (!materialDoc) {
      res.status(400).json({ message: 'material does not reference an existing Material' });
      return;
    }

    for (const p of pairs) {
      if (!p.left || !p.right) {
        res.status(400).json({ message: 'Each pair needs both "left" and "right"' });
        return;
      }
    }

    const puzzle = await Puzzle.create({
      title,
      material,
      puzzleType: puzzleType || 'matching',
      pairs,
      createdBy: req.user!._id,
      generatedByAi: false,
    });

    res.status(201).json(puzzle);
  } catch (err) {
    next(err);
  }
}

export async function getPuzzles(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const puzzles = await Puzzle.find().populate("material", "title");
    res.json(puzzles);
  } catch(error) {
    next(error);
  }
}

export async function updatePuzzle(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json(puzzle)
  } catch(error) {
    next(error);
  } 
}

export async function deletePuzzle(req: Request, res: Response, next: Function): Promise <void> {
  try {
    await Puzzle.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" })
  } catch(error) {
    next(error);
  }
}

export async function solvePuzzle(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      res.status(404).json({ message: "puzzle not found" });
      return;
    }

    const { correctPairs, totalPairs, timeTakenSec } = req.body as solveBody;

    const attempt = await PuzzleAttempt.create({
      puzzle: puzzle.id,
      patient: req.user!._id,
      correctPairs,
      totalPairs,
      timeTakenSec
    });
    res.status(201).json(attempt);
  } catch(error) {
    next(error)
  }
}

export async function getMyPuzzlesStats(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const stats = await getStudentStats(req.user!._id);
    res.json(stats.puzzleAttempts);
  } catch(error) {
    next(error);
  }
}

export async function getLeaderboard(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const board = await getPuzzleLeaderboard;
    res.json(board);
  } catch(error) {
    next(error);  
  }
}

export async function getPuzzleById(req: Request, res: Response, next: Function): Promise<void> {
  try {
    const puzzle = await getPuzzleByIdService(req.params.id as unknown as string);

    if (!puzzle) {
      res.status(404).json({ message: "Puzzle not found" });
      return;
    }

    res.json(puzzle);
  } catch (error) {
    next(error);
  }
}