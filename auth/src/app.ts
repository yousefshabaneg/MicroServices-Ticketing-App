import express from "express";
import { currentUserRouter } from "./routes/currentUser.route";
import { signupRouter } from "./routes/signUp.route";
import { signinRouter } from "./routes/signIn.route";
import { signoutRouter } from "./routes/signOut.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { NotFoundError } from "./errors/NotFoundError";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all(/(.*)/, async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

export { app };
