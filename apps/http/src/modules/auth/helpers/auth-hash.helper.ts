import bcrypt from 'bcrypt';

export const generateHashPassword = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};
