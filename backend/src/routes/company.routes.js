import { Router } from "express";
import { getMyCompany, upsertCompany } from "../controllers/company.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/me")
  .get(verifyJWT, authorizeRoles("employer"), getMyCompany)
  .put(verifyJWT, authorizeRoles("employer"), upsertCompany);

export default router;
