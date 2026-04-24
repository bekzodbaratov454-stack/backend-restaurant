import Joi from "joi";


export const RegisterSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "Name matn bo'lishi kerak",
      "string.empty": "Name bush bo'lmasligi kerak",
      "string.min": "Name kamida 3 ta harf bolishi kerak",
      "any.required": "Name majburiy",
    }),



  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email notog'ri formatda",
      "any.required": "Email majburiy",
    }),



  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Parol kamida 6 ta bulishi kerak",
      "any.required": "Parol majburiy",
    }),

    
    

  role: Joi.string()
    .valid("user", "admin")
    .optional()
    .messages({
      "any.only": "Role faqat user yoki admin bolishi mumkin",
    }),
});