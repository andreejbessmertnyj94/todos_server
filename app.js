require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const tasks = require("./modules/tasks/route");

const app = express();

const mongoDB = process.env.MONGODB_URI;

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.error(err.reason));

mongoose.set("debug", true);
mongoose.set("returnOriginal", false);

mongoose.connection.on("error", () => {
  console.error("MongoDB connection error");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function error(err, req, res, next) {
  if (err.name === "CastError") {
    console.error(err.message);
    res.status(400).json({ message: "Bad request" });
  } else if (err.name === "ValidationError") {
    console.error(err.message);
    res.status(400).json({ message: err.errors.content.message });
  } else if (err.name === "MongooseServerSelectionError") {
    console.error(err.message);
    res.status(503).json({ message: "Service Unavailable" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

app.use("/tasks", tasks);

app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

app.use(error);

const port = process.env.EXPRESS_PORT;

const server = app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
