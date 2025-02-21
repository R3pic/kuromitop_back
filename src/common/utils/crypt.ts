import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(hashedPassword: string, password: string) {
  return await bcrypt.compare(password, hashedPassword);
}