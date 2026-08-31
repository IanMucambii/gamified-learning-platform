import { Request, Response, NextFunction } from "express";
import Puzzle from "../models/Puzzle";
import Material from "../models/Material";
import PuzzleAttempt from "../models/PuzzleAttempt";
// import { generatePuzzle } from "../services/aiGenerator.service";
import { getStudentStats, getPuzzleLeaderboard } from "../services/stats.service";

interface solveBody {
  correctPairs: number;
  totalPairs: number;
  timeTakenSec?: number;
}

export async function generateFromMaterial(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const material = await Material.findById(req.params.MaterialId);
    if (!material) {
      res.status(404).json({ message: "MaterialNotFound"});
      return;
    }

    // const { puzzleType, pairs } = await generatePuzzle(material.content || '');
    // const puzzle = await Puzzle.create({
    //   title: `Puzzle - ${material.title}`,
    //   material: material.id,
    //   createdBy: req.user!._id,
    //   puzzleType,
    //   pairs,
    //   generatedByAi: true,
    // });
    // res.status(201).json(puzzle);
  } catch(error) {
    next(error);
  }
}

export async function createPuzzle(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const puzzle = await Puzzle.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json(puzzle);
  } catch(error) {
    next(error);
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
    res.json("Deleted")
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