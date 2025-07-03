import express from "express";
import {
  NotFoundError,
  errorMiddleware,
  CurrentUserMiddleware,
} from "@joe-tickets/common";
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

app.use(CurrentUserMiddleware.currentUser);

app.all(/(.*)/, async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

export { app };
