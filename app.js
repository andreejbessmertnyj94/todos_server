require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const port = process.env.EXPRESS_PORT;
require("./middleware/db");

const tasksRouter = require("./modules/tasks/route");
const usersRouter = require("./modules/users/route");
const auth = require("./middleware/auth");
const error = require("./middleware/error");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/tasks", auth, tasksRouter);

// Error handling
app.use(error);

const server = app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
