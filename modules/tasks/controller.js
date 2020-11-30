const Task = require("./model");

exports.create = async function (req, res, next) {
  try {
    const result = await Task.create({
      content: req.body.content,
    });
    res.status(201).json({ message: "Create successful", data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.list = async function (req, res, next) {
  try {
    const tasks = await Task.find({});
    // await new Promise(r => setTimeout(r, 5000));
    res.json({ message: "Fetch successful", data: tasks });
  } catch (err) {
    return next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const result = await Task.findByIdAndUpdate(
      req.params.id,
      {
        completed: req.body.completed,
        content: req.body.content,
      },
      { omitUndefined: true, runValidators: true }
    );

    if (!result) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Update successful", data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.updateAll = async function (req, res, next) {
  try {
    await Task.updateMany(
      { completed: !req.body.completed },
      {
        completed: req.body.completed,
        content: req.body.content,
      },
      { omitUndefined: true, runValidators: true }
    );
    res.json({ message: "Update successful" });
  } catch (err) {
    return next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Delete successful", data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.deleteAll = async function (req, res, next) {
  try {
    await Task.deleteMany({ completed: req.body.completed });
    res.json({ message: "Delete successful" });
  } catch (err) {
    return next(err);
  }
};
