const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => console.error(err.reason));

if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}
mongoose.set("returnOriginal", false);

mongoose.connection.on("error", () => {
  console.error("MongoDB connection error");
});
