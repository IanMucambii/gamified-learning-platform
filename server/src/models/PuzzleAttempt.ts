import mongoose, { Document, Types, Schema } from "mongoose";

export interface IPuzzleAttempt extends Document{
  _id: Types.ObjectId,
  puzzle: Types.ObjectId,
  patient: Types.ObjectId,
  correctPairs: number,
  totalPairs: number,
  timeTakenSec?: number,
  createdAt: Date;
  updatedAt: Date;
}

const puzzleAttemptSchema = new Schema<IPuzzleAttempt>(
  {
    puzzle: { type: Types.ObjectId, ref: "Quiz", required: true},
    patient: { type: Types.ObjectId, ref: "User", required: true},
    correctPairs: { type: Number, required: true},
    totalPairs: { type: Number, required: true},
    timeTakenSec: { type: Number}
  },
  { timestamps: true}
);

export default mongoose.model<IPuzzleAttempt>("PuzzleAttempt", puzzleAttemptSchema);