import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, status: "active" });
  if (!job) {
    throw new ApiError(404, "Active job not found");
  }

  const candidate = await User.findById(req.user._id);
  const existingApplication = await Application.findOne({
    candidate: req.user._id,
    job: job._id,
  });

  if (existingApplication) {
    throw new ApiError(409, "You have already applied to this job");
  }

  let uploadedResumeUrl;
  let uploadedResumePublicId;
  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path, {
      folder: "resumes",
      resource_type: "auto",
    });
    uploadedResumeUrl = cloudinaryResponse.secure_url;
    uploadedResumePublicId = cloudinaryResponse.public_id;
  }

  const profileResumeUrl = candidate.candidateProfile?.resumeUrl;
  const resumeUrl = uploadedResumeUrl || profileResumeUrl;

  if (!resumeUrl) {
    throw new ApiError(
      400,
      "Upload a resume before applying, or attach one with this request",
    );
  }

  if (uploadedResumeUrl) {
    candidate.candidateProfile.resumeUrl = uploadedResumeUrl;
    candidate.candidateProfile.resumePublicId = uploadedResumePublicId;
    await candidate.save({ validateBeforeSave: false });
  }

  const application = await Application.create({
    candidate: req.user._id,
    job: job._id,
    employer: job.employer,
    resumeUrl,
    coverLetter: req.body.coverLetter,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, application, "Application submitted"));
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: "job",
      select: "title location type workMode status company",
      populate: { path: "company", select: "name logoUrl" },
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "Applications fetched"));
});

export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.jobId,
    employer: req.user._id,
  });
  if (!job) {
    throw new ApiError(404, "Job not found or not owned by you");
  }

  const applications = await Application.find({ job: job._id })
    .populate("candidate", "fullName email candidateProfile")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "Applicants fetched"));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const application = await Application.findOneAndUpdate(
    { _id: req.params.applicationId, employer: req.user._id },
    { status },
    { new: true, runValidators: true },
  ).populate("candidate", "fullName email");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, application, "Application status updated"));
});
