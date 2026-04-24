import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();


router.post("/", authMiddleware, roleMiddleware("admin"), upload.single('image'), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), productController.updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), productController.deleteProduct);


export default router;