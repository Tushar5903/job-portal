import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    website: String,
    logoUrl: String,
    industry: String,
    size: String,
    location: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

companySchema.index({ name: "text", industry: "text", location: "text" });

export const Company = mongoose.model("Company", companySchema);
