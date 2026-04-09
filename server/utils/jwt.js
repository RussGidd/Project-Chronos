import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export function createToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}
