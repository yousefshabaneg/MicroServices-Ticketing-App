import { Request, Response } from "express";

class CurrentUserController {
  static currentUser = async (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser || null });
  };
}

export { CurrentUserController };
