import { ForbiddenException } from "../exceptions/forbidden.exception.js";
 
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenException("Not authenticated"));
    }
 
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenException("Access denied: insufficient role"));
    }
 
    next();
  };
};
 
export default roleMiddleware;
 