import mongoose, { Document, Schema, Types} from "mongoose";

export interface IJob extends Document {
  userId: Types.ObjectId;
  company: string;
  position: string;
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected";
  notes?: string;
  appliedAt?: Date;
}

export const jobSchema = new Schema<IJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["saved", "applied", "interviewing", "offer", "rejected"],
      default: "saved",
    },
    notes: { type: String },
    appliedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IJob>("Job", jobSchema);
