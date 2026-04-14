import bcrypt from "bcrypt";

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPin(pin, saltRounds = DEFAULT_SALT_ROUNDS) {
  // WHY: Centralizing PIN hashing keeps auth rules consistent across routes and seed scripts.
  return bcrypt.hash(pin, saltRounds);
}

export async function comparePin(pin, pinHash) {
  // WHY: A shared compare helper avoids repeating security-critical logic in multiple files.
  return bcrypt.compare(pin, pinHash);
}
