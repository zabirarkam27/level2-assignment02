import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
      }

      const token = authHeader.trim();
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as
        | (JwtPayload & {
            id: number;
            role: string;
            name: string;
            email: string;
          })
        | undefined;

      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You don't have permission to access this resource",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

export default auth;
