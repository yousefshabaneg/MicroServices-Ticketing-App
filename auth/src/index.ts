import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
