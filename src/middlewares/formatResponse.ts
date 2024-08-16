import { Request, Response, NextFunction } from "express";
import Log from "../models/LogModel";

export default function responseFormatter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const path = req.path;

  res.json = ((originalJson) => (body: any) => {
    console.log(req.body.user);

    const formattedBody = {
      code: res.statusCode,
      status: res.statusCode >= 400 ? "failed" : "success",
      data: body,
    };
    const errorReason = res.statusCode >= 400 ? body.error : null;

    Log.create({
      user_id: 1,
      method: req.method,
      endpoint: path,
      status: res.statusCode,
      error_reason: errorReason ? JSON.stringify(errorReason) : null,
    })
      .then(() => {
        console.log("Log has been recorded.");
      })
      .catch((err) => {
        console.error("Error logging response:", err);
      });

    return originalJson.call(res, formattedBody);
  })(res.json);

  next();
}
