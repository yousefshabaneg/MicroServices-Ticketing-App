import { Request, Response } from "express";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/BadRequestError";
import jwt from "jsonwebtoken";

class SignUpController {
  static signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });

    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).json(user);
  };
}

export { SignUpController };
