import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId,
  selected: string
}

export interface IQuizAttempt extends Document{
  _id: Types.ObjectId,
  quiz: Types.ObjectId,
  patient: Types.ObjectId
  answers: IAnswer[],
  score: number,
  total: number,
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  questionId: { type: Types.ObjectId, required: true },
  selected: { type: String, required: true}
});

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz: { type: Types.ObjectId, ref: "Quiz", required: true},
    patient: { type: Types.ObjectId, ref: "User", required: true},
    answers: { type: [answerSchema], default: []},
    score: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);