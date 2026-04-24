import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
});