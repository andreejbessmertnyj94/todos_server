const Task = require("./model");

exports.create = async (req, res, next) => {
  try {
    const result = await Task.create({ ...req.body, user_id: req.user._id });
    res.status(201).json({ message: "Create successful", data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user_id: req.user._id });
    res.json({ message: "Fetch successful", data: tasks });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await Task.findOneAndUpdate(
      {
        user_id: req.user._id,
        _id: req.params.id,
      },
      req.body,
      {
        omitUndefined: true,
        runValidators: true,
      }
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

exports.updateAll = async (req, res, next) => {
  try {
    await Task.updateMany(
      { user_id: req.user._id, completed: !req.body.completed },
      req.body,
      {
        omitUndefined: true,
        runValidators: true,
      }
    );
    res.json({ message: "Update successful" });
  } catch (err) {
    return next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await Task.findOneAndDelete({
      user_id: req.user._id,
      _id: req.params.id,
    });

    if (!result) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Delete successful", data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Task.deleteMany({
      user_id: req.user._id,
      completed: req.body.completed,
    });
    res.json({ message: "Delete successful" });
  } catch (err) {
    return next(err);
  }
};
