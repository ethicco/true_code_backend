import { pbkdf2 } from 'node:crypto';

const PASSWORD_LENGTH = 256;
const BYTE_TO_STRING_ENCODING: BufferEncoding = 'hex';
const ITERATIONS = 10000;
const DIGEST = 'sha256';

export const generateHashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (err, hash) => {
      if (err) {
        return reject(err);
      }

      resolve(hash.toString(BYTE_TO_STRING_ENCODING));
    });
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
  salt: string,
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (err, hash) => {
      if (err) {
        return reject(err);
      }

      resolve(passwordHash === hash.toString(BYTE_TO_STRING_ENCODING));
    });
  });
};
