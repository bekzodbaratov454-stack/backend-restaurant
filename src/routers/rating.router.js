import { Router } from "express";
import ratingController from "../controllers/rating.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = Router();

// Public — reyting qo'yish (login shart emas, device_id bilan)
router.post("/", ratingController.rateProduct);

// Public — bitta mahsulot reytingi
router.get("/product/:id", ratingController.getProductRating);

// Admin only — barcha statistika
router.get("/stats", authMiddleware, roleMiddleware("admin"), ratingController.getStats);

export default router;
