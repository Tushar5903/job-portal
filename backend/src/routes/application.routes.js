import { Router } from "express";
import {
  applyToJob,
  getApplicantsForJob,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/jobs/:jobId")
  .post(verifyJWT, authorizeRoles("candidate"), upload.single("resume"), applyToJob);
router.route("/me").get(verifyJWT, authorizeRoles("candidate"), getMyApplications);
router.route("/jobs/:jobId/applicants").get(verifyJWT, authorizeRoles("employer"), getApplicantsForJob);
router
  .route("/:applicationId/status")
  .patch(verifyJWT, authorizeRoles("employer"), updateApplicationStatus);

export default router;
