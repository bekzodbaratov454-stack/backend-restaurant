import { BadRequestException } from "../exceptions/bad-request.exception.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(
        new BadRequestException(error.details[0].message)
      );
    }

    next();
  };
};