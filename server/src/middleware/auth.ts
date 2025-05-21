import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// Protect routes middleware
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Check if token exists in cookies
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
    return;
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`
      });
      return;
    }
    next();
  };
};
