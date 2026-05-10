import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../constants.js";

const candidateProfileSchema = new Schema(
  {
    headline: String,
    location: String,
    phone: String,
    skills: [{ type: String, trim: true }],
    experienceYears: { type: Number, default: 0 },
    education: String,
    resumeUrl: String,
    resumePublicId: String,
  },
  { _id: false },
);

const employerProfileSchema = new Schema(
  {
    designation: String,
    phone: String,
    company: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "candidate",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    candidateProfile: candidateProfileSchema,
    employerProfile: employerProfileSchema,
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = function isPasswordCorrect(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function generateAccessToken() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" },
  );
};

export const User = mongoose.model("User", userSchema);
