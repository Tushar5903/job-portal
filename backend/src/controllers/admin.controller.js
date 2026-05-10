import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const getAdminStats = asyncHandler(async (_, res) => {
  const [
    users,
    candidates,
    employers,
    companies,
    jobs,
    activeJobs,
    applications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "candidate" }),
    User.countDocuments({ role: "employer" }),
    Company.countDocuments(),
    Job.countDocuments(),
    Job.countDocuments({ status: "active" }),
    Application.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      users,
      candidates,
      employers,
      companies,
      jobs,
      activeJobs,
      applications,
    }),
  );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const role = req.query.role;
  const filters = role ? { role } : {};
  const users = await User.find(filters)
    .select("-password")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isActive: Boolean(req.body.isActive) },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User status updated"));
});

export const getAllJobsForAdmin = asyncHandler(async (req, res) => {
  const statusFilter = req.query.status ? { status: req.query.status } : {};
  const jobs = await Job.find(statusFilter)
    .populate("company", "name")
    .populate("employer", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched"));
});

export const getAllCompaniesForAdmin = asyncHandler(async (_, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, companies, "Companies fetched"));
});

export const getAllApplicationsForAdmin = asyncHandler(async (_, res) => {
  const applications = await Application.find()
    .populate("job", "title location")
    .populate("candidate", "fullName email candidateProfile")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "Applications fetched"));
});

export const updateJobStatusByAdmin = asyncHandler(async (req, res) => {
  if (!req.body.status) {
    throw new ApiError(400, "Status is required");
  }

  const job = await Job.findByIdAndUpdate(
    req.params.jobId,
    { status: req.body.status },
    { new: true, runValidators: true },
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job status updated"));
});
