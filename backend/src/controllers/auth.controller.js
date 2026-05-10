import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { parseList } from "../utils/parseList.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    role = "candidate",
    headline,
    location,
    phone,
    skills,
    experienceYears,
    education,
    companyName,
    designation,
    website,
    industry,
    size,
    description,
    adminSetupKey,
  } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "Full name, email, and password are required");
  }

  if (role === "admin" && adminSetupKey !== process.env.ADMIN_SETUP_KEY) {
    throw new ApiError(403, "Admin setup key is invalid");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    candidateProfile:
      role === "candidate"
        ? {
            headline,
            location,
            phone,
            skills: parseList(skills),
            experienceYears,
            education,
          }
        : undefined,
    employerProfile:
      role === "employer"
        ? {
            designation,
            phone,
          }
        : undefined,
  });

  if (role === "employer" && companyName) {
    const company = await Company.create({
      name: companyName,
      website,
      industry,
      size,
      location,
      description,
      owner: user._id,
    });

    user.employerProfile = {
      ...user.employerProfile,
      company: company._id,
    };
    await user.save({ validateBeforeSave: false });
  }

  const createdUser = await User.findById(user._id).select("-password").populate("employerProfile.company");
  const accessToken = user.generateAccessToken();

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(201, { user: createdUser, accessToken }, "Registration successful"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password").populate("employerProfile.company");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful"));
});

export const logoutUser = asyncHandler(async (_, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("employerProfile.company");
  return res.status(200).json(new ApiResponse(200, user, "Current user fetched"));
});
