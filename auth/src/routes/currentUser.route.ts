import express from "express";
import { CurrentUserController } from "../controllers/currentUser.controller";
import { CurrentUserMiddleware } from "../middlewares/currentUser.middleware";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  CurrentUserMiddleware.currentUser,
  CurrentUserController.currentUser
);

export { router as currentUserRouter };
