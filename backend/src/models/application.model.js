import mongoose, { Schema } from "mongoose";
import { APPLICATION_STATUSES } from "../constants.js";

const applicationSchema = new Schema(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: String,
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
      index: true,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
