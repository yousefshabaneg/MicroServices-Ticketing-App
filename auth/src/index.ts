import express from "express";
import { currentUserRouter } from "./routes/currentUser.route";
import { signupRouter } from "./routes/signUp.route";
import { signinRouter } from "./routes/signIn.route";
import { signoutRouter } from "./routes/signOut.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { NotFoundError } from "./errors/NotFoundError";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all(/(.*)/, async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

start();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
