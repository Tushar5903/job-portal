import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

export const upsertCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can manage company profiles");
  }

  const { name, website, logoUrl, industry, size, location, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Company name is required");
  }

  const companyId = req.user.employerProfile?.company;
  const company = companyId
    ? await Company.findOneAndUpdate(
        { _id: companyId, owner: req.user._id },
        { name, website, logoUrl, industry, size, location, description },
        { new: true, runValidators: true },
      )
    : await Company.create({
        name,
        website,
        logoUrl,
        industry,
        size,
        location,
        description,
        owner: req.user._id,
      });

  await User.findByIdAndUpdate(req.user._id, {
    $set: { "employerProfile.company": company._id },
  });

  return res.status(200).json(new ApiResponse(200, company, "Company profile saved"));
});

export const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  return res.status(200).json(new ApiResponse(200, company, "Company profile fetched"));
});
