import mongoose, { Schema } from "mongoose";
import { JOB_TYPES, WORK_MODES } from "../constants.js";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true, index: true }],
    location: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: JOB_TYPES,
      default: "full-time",
      index: true,
    },
    workMode: {
      type: String,
      enum: WORK_MODES,
      default: "onsite",
      index: true,
    },
    minExperience: {
      type: Number,
      default: 0,
    },
    salaryMin: Number,
    salaryMax: Number,
    openings: {
      type: Number,
      default: 1,
    },
    deadline: Date,
    status: {
      type: String,
      enum: ["draft", "active", "closed"],
      default: "active",
      index: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  location: "text",
});

export const Job = mongoose.model("Job", jobSchema);
