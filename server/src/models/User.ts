import mongoose, { Document, Schema, Types } from "mongoose";

export type Role = "admin" | "Doctor" | "Patient"

export interface IUser extends Document {
  _id: Types.ObjectId,
  name: string,
  email: string,
  password: string,
  role: Role,
  isApproved: boolean,
  supervisor: Types.ObjectId | null
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["admin", "patient", "doctor"], required: true},
    isApproved: {
      type: Boolean,
      default: function (this: IUser) {
        return this.role !=="Doctor"
      }
    },
    supervisor: { type: Schema.Types.ObjectId, ref: "User", default: null}
  },
  { timestamps: true}
);

export default mongoose.model<IUser>("user", userSchema);