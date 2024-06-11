import express from "express";
import { JwtChecker, JwtParse } from "../middleware/auth.middleware";
import orderController from "../controllers/order.controller";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  JwtChecker,
  JwtParse,
  orderController.createCheckoutSession
);

router.post("/checkout/webhook", orderController.stripeWebhookController);

router.get("/", JwtChecker, JwtParse, orderController.getOrders);

export default router;
