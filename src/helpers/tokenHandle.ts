import jwt from "jsonwebtoken";
import env from "../configs/environments";

export const tokenGenerate = (payload: any, type: "access" | "refresh") => {
  const expiresIn = type == "access" ? "5m" : "24h";
  const key = type == "access" ? env.access_token_key : env.refresh_token_key;
  return jwt.sign(payload, key, { expiresIn });
};

export const tokenVerify = async (
  token: string,
  type: "access" | "refresh"
) => {
  try {
    const key = type == "access" ? env.access_token_key : env.refresh_token_key;
    const decoded = jwt.verify(token, key) as jwt.JwtPayload;

    if (!decoded.exp) {
      throw new Error("Invalid token: missing expiration");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    const { exp, iat, ...rest } = decoded;
    return { ...rest };
  } catch (err) {
    throw err;
  }
};
