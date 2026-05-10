import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, _, res, __) => {
  let statusCode = err instanceof ApiError ? err.statusCode : err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate record already exists";
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};
