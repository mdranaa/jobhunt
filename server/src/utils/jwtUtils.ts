import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || ' ';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || ' ';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  const payload: TokenPayload = { id: userId };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn']
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
