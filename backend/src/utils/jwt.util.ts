import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "@/config/env.config";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_KEY = JWT_ACCESS_SECRET_KEY ?? "";
const REFRESH_KEY = JWT_REFRESH_SECRET_KEY ?? "";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

type Payload = object | string;

export const generateAccessToken = (payload: Payload): string =>
  jwt.sign(payload, ACCESS_KEY, { expiresIn: ACCESS_EXPIRES_IN });

export const generateRefreshToken = (payload: Payload): string =>
  jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_EXPIRES_IN });

export const verifyAccessToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, ACCESS_KEY);
  } catch(err) {
    console.log(err);
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, REFRESH_KEY);
  } catch(err){
    console.log(err);
    return null;
  }
};

