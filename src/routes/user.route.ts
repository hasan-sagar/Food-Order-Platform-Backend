import express from "express";
const router = express.Router();
import UserController from "../controllers/user.controller";
import { JwtChecker, JwtParse } from "../middleware/auth.middleware";
import { validateUserRequest } from "../middleware/validation";

router.post("/", JwtChecker, UserController.CreateUserController);
router.put(
  "/",
  JwtChecker,
  JwtParse,
  validateUserRequest,
  UserController.UpdateUserController
);
router.get("/", JwtChecker, JwtParse, UserController.GetLoggedInUser);

export default router;
