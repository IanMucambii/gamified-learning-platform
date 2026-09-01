import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResonanceImage {
  _id?: Types.ObjectId;
  url: string;
  label: string;
}

export interface IResonanceGame extends Document {
  _id: Types.ObjectId;
  title: string;
  material?: Types.ObjectId;
  createdBy: Types.ObjectId;
  images: IResonanceImage[];       // targets patient must remember
  distractors: IResonanceImage[];  // shown only during recall phase, as decoys
  displayDurationSec: number;      // seconds each target is shown during memorize phase
  generatedByAI: boolean;          // reserved for future AI-assisted labeling; false = manual
}

const imageSchema = new Schema<IResonanceImage>({
  url: { type: String, required: true },
  label: { type: String, required: true },
});

const resonanceGameSchema = new Schema<IResonanceGame>(
  {
    title: { type: String, required: true },
    material: { type: Schema.Types.ObjectId, ref: 'Material' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    images: { type: [imageSchema], required: true },
    distractors: { type: [imageSchema], default: [] },
    displayDurationSec: { type: Number, default: 4 },
    generatedByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IResonanceGame>('ResonanceGame', resonanceGameSchema);