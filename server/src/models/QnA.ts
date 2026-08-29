import mongoose, { Document, Schema, Types } from "mongoose";

export interface IQnA extends Document{
  _id: Types.ObjectId,
  question: string,
  answer?: string,
  askedBy: Types.ObjectId,
  answeredBy?: Types.ObjectId,
  material?: Types.ObjectId
}

const qnaSchema = new Schema<IQnA>(
  {
    question: { type: String, required: true},
    answer: { type: String },
    askedBy: { type: Types.ObjectId, ref: "User", required: true},
    answeredBy: { type: Types.ObjectId, ref: "User" },
    material: { type: Types.ObjectId, ref: "Material"}
  },
  { timestamps: true }
);

export default mongoose.model<IQnA>("QnA", qnaSchema);