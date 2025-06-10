import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/api/users/currentuser", (req, res) => {
  res.json({ message: "Hi there!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
