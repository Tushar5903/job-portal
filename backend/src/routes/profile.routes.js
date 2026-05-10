import { Router } from "express";
import { updateCandidateProfile, uploadResume } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/candidate").patch(verifyJWT, updateCandidateProfile);
router.route("/candidate/resume").post(verifyJWT, upload.single("resume"), uploadResume);

export default router;
