import Job from "../models/Job";
import { CreateJobInput } from "../types/job.types";

export const createJob = async (input: CreateJobInput) => {
  const job = await Job.create({
    userId: input.userId,
    company: input.company,
    position: input.position,
    status: input.status,
    notes: input.notes,
    appliedAt: input.appliedAt,
  });

  return job;
};

export const getJobs = async (userId: string) => {
  return Job.find({ userId }).sort({ createdAt: -1 });
};

export const updateJob = async (
  jobId: string,
  userId: string,
  data: Partial<CreateJobInput>,
) => {
  return Job.findOneAndUpdate({ _id: jobId, userId }, data, { new: true });
};

export const deleteJob = async (jobId: string, userId: string) => {
  return Job.findOneAndDelete({ _id: jobId, userId });
};
