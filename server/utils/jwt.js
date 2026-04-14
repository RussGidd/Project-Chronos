import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

function getJwtSecret() {
  // WHY: Failing fast on missing JWT config prevents issuing/verifying tokens with invalid secrets.
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required to use authentication.");
  }

  return jwtSecret;
}

export function createToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
