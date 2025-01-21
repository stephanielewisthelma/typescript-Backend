import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
  });
}

export const generateRefreshToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string
  })
}