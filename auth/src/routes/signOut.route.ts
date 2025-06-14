import express from "express";
import { SignOutController } from "../controllers/signOut.controller";

const router = express.Router();

router.post("/api/users/signout", SignOutController.signout);

export { router as signoutRouter };
