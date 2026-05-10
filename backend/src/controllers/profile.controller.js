import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { parseList } from "../utils/parseList.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const updateCandidateProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "candidate") {
    throw new ApiError(403, "Only candidates can update candidate profile");
  }

  const { headline, location, phone, skills, experienceYears, education } =
    req.body;
  const update = {
    "candidateProfile.headline": headline,
    "candidateProfile.location": location,
    "candidateProfile.phone": phone,
    "candidateProfile.education": education,
  };

  if (skills !== undefined)
    update["candidateProfile.skills"] = parseList(skills);
  if (experienceYears !== undefined)
    update["candidateProfile.experienceYears"] = Number(experienceYears);

  Object.keys(update).forEach(
    (key) => update[key] === undefined && delete update[key],
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: update },
    { new: true },
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (req.user.role !== "candidate") {
    throw new ApiError(403, "Only candidates can upload resumes");
  }

  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path, {
    folder: "resumes",
    resource_type: "auto",
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        "candidateProfile.resumeUrl": cloudinaryResponse.secure_url,
        "candidateProfile.resumePublicId": cloudinaryResponse.public_id,
      },
    },
    { new: true },
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Resume uploaded"));
});
