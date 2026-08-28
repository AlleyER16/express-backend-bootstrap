import { Response, NextFunction } from "express";

import { RawBodyRequest } from "../interfaces/request.interface";

// Parse raw
// Useful for cases where you want to directly get raw request body without any parsing e.g JSON parsing
// e.g Case where request signature needs to be validated
export function getRawRequestBody(req: RawBodyRequest, res: Response, next: NextFunction) {
  let rawData = "";

  // Listen for data events to collect chunks of data
  req.on("data", (chunk) => {
    rawData += chunk;
  });

  // Listen for the end event to signify that the entire body has been received
  req.on("end", () => {
    req.rawBody = rawData;

    next();
  });

  // Handle error event
  req.on("error", (err) => {
    throw err;
  });
}
