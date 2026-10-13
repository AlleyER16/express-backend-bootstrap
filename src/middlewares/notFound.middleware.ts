import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "after" })
export default class NotFoundMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!res.headersSent) {
      res.status(404).json({
        status: "error",
        message: "Route not found",
      });
    }
  }
}
