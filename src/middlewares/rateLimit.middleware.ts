import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Define the rate limit configuration
export default function rateLimiter(minutes: number, maxRequests: number) {
  return rateLimit({
    windowMs: minutes * 60 * 1000, // 15 minutes
    max: maxRequests, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
    headers: true, // Send RateLimit headers
    handler: (req: Request, res: Response, next: NextFunction) => {
      res.status(429).json({
        status: "error",
        message: "You have exceeded the allowed number of requests. Try again later.",
        error: "Too many requests",
      });
    },
  });
}
