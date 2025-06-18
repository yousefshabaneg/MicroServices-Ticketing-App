import express from "express";
import { CurrentUserController } from "../controllers/currentUser.controller";
import { CurrentUserMiddleware } from "@joe-tickets/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  CurrentUserMiddleware.currentUser,
  CurrentUserController.currentUser
);

export { router as currentUserRouter };
