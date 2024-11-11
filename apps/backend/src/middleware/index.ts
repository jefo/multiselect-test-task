import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import { logger } from "../utils/logger";
import { ZodError } from "zod";

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS middleware
export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Error handling middleware
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors,
    });
  } else if (err.message.includes("not found")) {
    res.status(404).json({
      error: "Not Found",
      message: err.message,
    });
  } else if (
    err.message.includes("Invalid") ||
    err.message.includes("duplicate")
  ) {
    res.status(400).json({
      error: "Bad Request",
      message: err.message,
    });
  } else {
    res.status(500).json({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : err.message,
    });
  }
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
};
