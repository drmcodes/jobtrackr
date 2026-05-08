import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1, " Nombre de la empresa requerido"),
  position: z.string().min(1, " Posición requerida"),
  status: z
    .enum(["saved", "applied", "interviewing", "offer", "rejected"])
    .optional(),
  notes: z.string().optional(),
  appliedAt: z.coerce.date().optional(),
});

export const updateJobSchema = createJobSchema.partial();
