import { Request, Response } from "express";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/BadRequestError";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";

class SignInController {
  static signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).json(existingUser);
  };
}

export { SignInController };
