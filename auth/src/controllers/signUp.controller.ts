import { Request, Response } from "express";
import { User } from "../models/user.model";

class SignUpController {
  static signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email in use",
      });
      return;
    }

    const user = User.build({ email, password });

    await user.save();

    res.status(201).json(user);
  };
}

export { SignUpController };
