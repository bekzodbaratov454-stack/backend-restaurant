import { Router } from "express";
import feedbackController from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", feedbackController.createFeedback);
router.get("/", authMiddleware, roleMiddleware("admin"), feedbackController.getFeedbacks);
router.get("/:id", authMiddleware, roleMiddleware("admin"), feedbackController.getFeedBackById);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), feedbackController.deleteFeedback);

export default router;