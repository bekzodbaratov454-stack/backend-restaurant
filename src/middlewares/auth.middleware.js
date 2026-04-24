import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized.exception.js";


export const authMiddleware = (req, res, next) => {
    try {
        const token = req.signedCookies?.accessToken 
            || req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Token not provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); 
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new UnauthorizedException("Token is invalid or expired"));
        }
        next(error);
    }
};


export default authMiddleware;