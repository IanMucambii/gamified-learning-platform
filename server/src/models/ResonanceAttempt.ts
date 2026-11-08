import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResonanceAttempt extends Document {
  _id: Types.ObjectId;
  game: Types.ObjectId;
  student: Types.ObjectId;
  correctSelections: number;
  incorrectSelections: number;
  totalTargets: number;
  timeTakenSec?: number;
  createdAt: Date;
  updatedAt: Date;
}

const resonanceAttemptSchema = new Schema<IResonanceAttempt>(
  {
    game: { type: Schema.Types.ObjectId, ref: 'ResonanceGame', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    correctSelections: { type: Number, required: true },
    incorrectSelections: { type: Number, required: true },
    totalTargets: { type: Number, required: true },
    timeTakenSec: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IResonanceAttempt>('ResonanceAttempt', resonanceAttemptSchema);