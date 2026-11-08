import mongoose, { Document, Schema, Types } from "mongoose";
import { generateKey } from "node:crypto";

export interface IPuzzlePair{
  left: string;
  right: string;
}

export interface IPuzzle extends Document{
  _id: Types.ObjectId,
  title: string,
  material: Types.ObjectId,
  createdBy: Types.ObjectId,
  puzzleType: string, //"matching", "sequence", etc
  // add to each schema definition (Quiz.ts, Puzzle.ts, ResonanceGame.ts)
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  pairs: IPuzzlePair[],
  generatedByAi: boolean,
}

const pairSchema = new Schema<IPuzzlePair>({
  left: { type: String, required: true},
  right: { type: String, required: true}
});

const puzzleSchema = new Schema<IPuzzle>(
  {
    title: { type: String, required: true},
    material: { type: Types.ObjectId, ref: "Material", required: true},
    createdBy: { type: Types.ObjectId, ref: "User", required: true},
    puzzleType: { type: String, default: "matching"},
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    estimatedMinutes: { type: Number, default: 5 },
    xpReward: { type: Number, default: 50 },
    pairs: { type: [pairSchema], default: []},
    generatedByAi:{ type: Boolean, default: false }
  },
  { timestamps: true}
);

export default mongoose.model<IPuzzle>("Puzzle", puzzleSchema);