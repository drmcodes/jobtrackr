import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createJobSchema, updateJobSchema } from "../validators/job.validators";
const router = Router();

router.post(
  "/",
  authenticate,
  validate(createJobSchema),
  jobController.createJob,
);
router.get("/", authenticate, jobController.getJobs);
router.put(
  "/:id",
  authenticate,
  validate(updateJobSchema),
  jobController.updateJob,
);
router.delete("/:id", authenticate, jobController.deleteJob);

export default router;
