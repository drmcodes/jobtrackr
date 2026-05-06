import { Types } from "mongoose";

export interface CreateJobInput {
  userId: Types.ObjectId;
  company: string;
  position: string;
  status?: "saved" | "applied" | "interviewing" | "offer" | "rejected";
  notes?: string;
  appliedAt?: Date;
}
