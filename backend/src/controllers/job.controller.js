import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { escapeRegex, parseList } from "../utils/parseList.js";

const buildJobFilters = (query) => {
  const {
    q,
    location,
    type,
    workMode,
    skills,
    minSalary,
    maxExperience,
    company,
    status = "active",
  } = query;

  const filters = {};
  if (status) filters.status = status;
  if (q) filters.$text = { $search: q };
  if (location) filters.location = new RegExp(location, "i");
  if (type) filters.type = type;
  if (workMode) filters.workMode = workMode;
  if (company && mongoose.isValidObjectId(company)) filters.company = company;
  if (skills) {
    filters.skills = {
      $in: parseList(skills).map((skill) => new RegExp(`^${escapeRegex(skill)}$`, "i")),
    };
  }
  if (minSalary) filters.salaryMax = { $gte: Number(minSalary) };
  if (maxExperience) filters.minExperience = { $lte: Number(maxExperience) };

  return filters;
};

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    skills,
    location,
    type,
    workMode,
    minExperience,
    salaryMin,
    salaryMax,
    openings,
    deadline,
    status,
  } = req.body;

  if (!title || !description || !location) {
    throw new ApiError(400, "Title, description, and location are required");
  }

  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    throw new ApiError(400, "Create a company profile before posting jobs");
  }

  const job = await Job.create({
    title,
    description,
    requirements: parseList(requirements),
    skills: parseList(skills),
    location,
    type,
    workMode,
    minExperience,
    salaryMin,
    salaryMax,
    openings,
    deadline,
    status,
    employer: req.user._id,
    company: company._id,
  });

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

export const getJobs = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const filters = buildJobFilters(req.query);

  const [jobs, total] = await Promise.all([
    Job.find(filters)
      .populate("company", "name logoUrl industry location")
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments(filters),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }),
  );
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)
    .populate("company", "name logoUrl website industry size location description")
    .populate("employer", "fullName email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job fetched"));
});

export const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).populate("company", "name").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, jobs, "Employer jobs fetched"));
});

export const updateJob = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.skills !== undefined) update.skills = parseList(update.skills);
  if (update.requirements !== undefined) update.requirements = parseList(update.requirements);

  const job = await Job.findOneAndUpdate(
    { _id: req.params.jobId, employer: req.user._id },
    update,
    { new: true, runValidators: true },
  );

  if (!job) {
    throw new ApiError(404, "Job not found or not owned by you");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job updated"));
});

export const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.jobId, employer: req.user._id },
    { status: "closed" },
    { new: true },
  );

  if (!job) {
    throw new ApiError(404, "Job not found or not owned by you");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job closed"));
});
