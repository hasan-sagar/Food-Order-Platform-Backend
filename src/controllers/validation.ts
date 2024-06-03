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
