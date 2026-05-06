import { Request, Response } from "express";
import * as jobService from "../services/job.service";
import { Types } from "mongoose";

export const createJob = async (req: Request, res: Response) => {
  try {
    const { company, position, appliedAt, status, notes } = req.body;
    const userId = new Types.ObjectId(req.userId);

    const job = await jobService.createJob({
      company: company,
      position: position,
      appliedAt: appliedAt,
      userId: userId,
      status: status,
      notes: notes,
    });
    res.status(201).json({ job });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.getJobs(req.userId!);
    res.status(200).json(jobs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const jobId = req.params.id as string;
    const data = req.body;

    const job = await jobService.updateJob(jobId, userId, data);
    if (!job) {
      return res.status(404).json({ message: "Job no encontrado" });
    }
    res.json(job);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const jobId = req.params.id as string;

    const job = await jobService.deleteJob(jobId, userId!);
    if (!job) {
      return res.status(404).json({ message: "Job no encontrado" });
    }
    res.json({ message: "Job eliminado" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};
