import express from "express";
import multer from "multer";
import restaurantController from "../controllers/restaurant.controller";
import { JwtChecker, JwtParse } from "../middleware/auth.middleware";
import { validateRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  JwtChecker,
  JwtParse,
  restaurantController.CreateRestaurant
);

router.get("/", JwtChecker, JwtParse, restaurantController.GetRestaurant);

router.put(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  JwtParse,
  JwtChecker,
  restaurantController.updateRestaurant
);

router.get("/search/:city", restaurantController.RestaurantSearch);

router.get("/:restaurantId", restaurantController.GetSingleRestaurant);

router.get(
  "/get/orders",
  JwtChecker,
  JwtParse,
  restaurantController.GetRestaurantOrders
);

router.patch(
  "/order/:orderId/status",
  JwtChecker,
  JwtParse,
  restaurantController.UpdateOrderStatus
);

export default router;
