import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Error",
      message: errors.array(),
    });
  }
  next();
};

export const validateUserRequest = [
  body("name").isString().notEmpty().withMessage("Name field required"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address Line 1 field required"),

  body("city").isString().notEmpty().withMessage("City field required"),
  body("country").isString().notEmpty().withMessage("Country field required"),
  handleValidationErrors,
];

export const validateRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant field required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisine must be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("Menu item name field required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu item field required and must be a postive number"),
  handleValidationErrors,
];
