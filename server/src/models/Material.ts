import mongoose, { Schema, Types, Document} from "mongoose";

export type materialType = "pdf" | "text";

export interface IMaterial extends Document{
  _id: Types.ObjectId;
  title: string,
  type: materialType,
  content?: string,
  filePath?: string,
  uploadedBy: Types.ObjectId,
}

const materialSchema = new Schema<IMaterial>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf", "text"], required: true},
    content: { type: String },
    filePath: { type: String},
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true}
  },
  { timestamps: true}
)

export default mongoose.model<IMaterial>("Material", materialSchema)