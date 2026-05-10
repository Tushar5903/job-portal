import { Router } from "express";
import {
  getAdminStats,
  getAllJobsForAdmin,
  getAllUsers,
  getAllCompaniesForAdmin,
  getAllApplicationsForAdmin,
  updateJobStatusByAdmin,
  updateUserStatus,
} from "../controllers/admin.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.route("/stats").get(getAdminStats);
router.route("/users").get(getAllUsers);
router.route("/users/:userId/status").patch(updateUserStatus);
router.route("/jobs").get(getAllJobsForAdmin);
router.route("/companies").get(getAllCompaniesForAdmin);
router.route("/applications").get(getAllApplicationsForAdmin);
router.route("/jobs/:jobId/status").patch(updateJobStatusByAdmin);

export default router;
