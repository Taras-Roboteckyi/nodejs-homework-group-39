const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const dotenv = require("dotenv"); /* загружаєм змінні окружения из файла .env в process.env */
dotenv.config();

const usersRouter = require("./routes/api/users");
const usersCurrentRouter = require("./routes/api/currentUsers");
const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Дозволяєм експресу роздавати статичні файли з папки public

app.use("/api/users", usersRouter);
app.use("/api/users", usersCurrentRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message: message });
});

module.exports = app;
