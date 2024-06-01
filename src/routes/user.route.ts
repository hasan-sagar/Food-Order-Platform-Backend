import express from "express";
const router = express.Router();
import UserController from "../controllers/user.controller";

router.post("/", UserController.CreateUserController);

export default router;
