import { hash, compare } from 'bcrypt';

export const hashValue = async (value: string): Promise<string> => {
  return await hash(value, 10);
};

export const verifyHash = async (
  value: string,
  hash: string,
): Promise<boolean> => {
  return await compare(value, hash);
};
