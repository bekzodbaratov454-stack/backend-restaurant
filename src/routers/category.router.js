import express from "express";
import { Category } from "../models/category.model.js";
import CategoryController from "../controllers/category.controller.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

const controller = new CategoryController(Category);


router.post("/", authMiddleware, roleMiddleware("admin"), controller.createCategory);

router.get("/", controller.getCategories);

router.get("/:id", controller.getCategoryById);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), controller.deleteCategory);


export default router;