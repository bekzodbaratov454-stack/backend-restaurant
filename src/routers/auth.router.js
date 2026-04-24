import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";

import { RegisterSchema } from "../schemas/auth/register.schema.js";
import { LoginSchema } from "../schemas/auth/login.schema.js";

const router = Router();

router.post("/register", validate(RegisterSchema) , authController.register);
router.post("/login", validate(LoginSchema) , authController.login);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;


