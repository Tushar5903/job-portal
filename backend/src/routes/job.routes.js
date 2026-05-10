import { Router } from "express";
import {
  closeJob,
  createJob,
  getEmployerJobs,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/job.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getJobs).post(verifyJWT, authorizeRoles("employer"), createJob);
router.route("/employer/me").get(verifyJWT, authorizeRoles("employer"), getEmployerJobs);
router.route("/:jobId").get(getJobById).patch(verifyJWT, authorizeRoles("employer"), updateJob);
router.route("/:jobId/close").patch(verifyJWT, authorizeRoles("employer"), closeJob);

export default router;
