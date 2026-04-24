import { Router } from "express";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import productRouter from "./product.router.js";
import feedbackRouter from "./feedback.router.js";

const router = Router();


router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/feedback", feedbackRouter);



export default router;




