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
    generatedByAI: { type: Boolean, required: true}
  },
  { timestamps: true }
)

export default mongoose.model<IQuiz>("Quiz", quizSchema);