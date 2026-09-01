import Puzzle from "../models/Puzzle"; // adjust path to your actual model file

export async function getPuzzleById(id: string) {
  return Puzzle.findById(id).populate("material", "title phrases").lean();
}