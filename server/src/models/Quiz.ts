import mongoose, { Document, Schema, Types } from "mongoose";

export interface IQuestion {
  _id?: Types.ObjectId,
  question: string,
  options: string[],
  correctAnswer: string,
}

export interface IQuiz extends Document{
  _id: Types.ObjectId,
  title: string,
  material: Types.ObjectId,
  createdBy: Types.ObjectId,
  // add to each schema definition (Quiz.ts, Puzzle.ts, ResonanceGame.ts)
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  questions: IQuestion[],
  generatedByAI: boolean
}

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: {type: String, required: true }
});

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true},
    material: { type: Schema.Types.ObjectId, ref: "Material", required: true},
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true},
    questions: { type: [questionSchema], default: []},
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    estimatedMinutes: { type: Number, default: 5 },
    xpReward: { type: Number, default: 50 },
    generatedByAI: { type: Boolean, required: true}
  },
  { timestamps: true }
)

export default mongoose.model<IQuiz>("Quiz", quizSchema);