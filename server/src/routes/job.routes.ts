import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, jobController.createJob);
router.get("/", authenticate, jobController.getJobs);
router.put("/:id", authenticate, jobController.updateJob);
router.delete("/:id", authenticate, jobController.deleteJob);

export default router;
