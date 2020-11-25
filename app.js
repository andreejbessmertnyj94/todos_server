const express = require("express");
// const cors = require("cors");
const morgan = require("morgan");

const tasks = require("./modules/tasks/route");

const app = express();

const mongoose = require("mongoose");
let dev_db_url = "mongodb://apiUser:Qaz123@localhost:27017/todos";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
mongoose.set("debug", true);
mongoose.set("returnOriginal", false);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// app.use(cors({ origin: '*' }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/tasks", tasks);

app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

const port = 3001;

const server = app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
