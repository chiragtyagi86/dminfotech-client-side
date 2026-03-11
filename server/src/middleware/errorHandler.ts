// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[ErrorHandler]", err);

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({ message: "File too large." });
    return;
  }
  if (err.message?.includes("must be") || err.message?.includes("Invalid file")) {
    res.status(400).json({ message: err.message });
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
}