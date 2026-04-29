import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import { RegisterSchema } from "../schemas/auth/register.schema.js";
import { LoginSchema } from "../schemas/auth/login.schema.js";

const router = Router();

router.post("/register", validate(RegisterSchema) , authController.register);
router.post("/login", validate(LoginSchema) , authController.login);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/users", authMiddleware, roleMiddleware("admin"), authController.getAllUsers);

export default router;


