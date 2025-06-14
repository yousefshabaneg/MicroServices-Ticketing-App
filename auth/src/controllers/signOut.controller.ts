import { Request, Response } from "express";

class SignOutController {
  static signout = async (req: Request, res: Response) => {
    req.session = null;
    res.status(200).json({});
  };
}

export { SignOutController };
