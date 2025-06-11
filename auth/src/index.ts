import express from "express";
import { currentUserRouter } from "./routes/currentUser.route";
import { signupRouter } from "./routes/signUp.route";
import { signinRouter } from "./routes/signIn.route";
import { signoutRouter } from "./routes/signOut.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all(/(.*)/, async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
