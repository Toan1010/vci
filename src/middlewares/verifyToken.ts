import { NextFunction, Request, Response } from "express";
import { tokenVerify } from "../helpers/tokenHandle";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Access token required" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (accessToken == null) {
      return res.status(401).json({ error: "Access token required" });
    }
    const user = await tokenVerify(accessToken, "access");
    if (!user) {
      return res.status(403).json({ error: "Invalid access token" });
    }
    req.body.user = user;
    next();
  } catch (error: any) {
    console.error(error.message);
    if (error.message === "jwt expired") {
      res.status(401).json({ error: "Access token expired" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await verifyAccessToken(req, res, async () => {
      const user = req.body.user;
      if (user && user.role === "super_admin") {
        return next();
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await verifyAccessToken(req, res, async () => {
      const user = req.body.user;
      const id = req.params.id;
      if (user && (user.role === "super_admin" || user.id === id)) {
        return next();
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
