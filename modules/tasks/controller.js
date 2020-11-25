const Task = require("./model");

exports.create = function (req, res, next) {
  if (Object.keys(req.body).length === 0 || req.body.content.length > 120) {
    res.status(400).end();
    return;
  }
  const task = new Task({
    content: req.body.content,
  });

  task.save(function (err) {
    if (err) {
      return next(err);
    }
    res.json(task);
  });
};

exports.list = async function (req, res) {
  const tasks = await Task.find({});
  // await new Promise(r => setTimeout(r, 3000));
  res.json(tasks);
};

exports.update = function (req, res, next) {
  if (req.params.id.match(/^[a-f0-9]{24}$/gm) === null) {
    res.status(404).end();
    return;
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400).end();
    return;
  }
  Task.findByIdAndUpdate(
    req.params.id,
    {
      completed: req.body.completed,
    },
    function (err, task) {
      if (err) return next(err);
      if (task === null) {
        res.status(404).end();
        return;
      }
      res.json(task);
    }
  );
};

exports.updateAll = function (req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).end();
    return;
  }
  Task.updateMany(
    { completed: !req.body.completed },
    {
      completed: req.body.completed,
    },
    function (err) {
      if (err) return next(err);
      res.json({ message: "Update successful" });
    }
  );
};

exports.delete = function (req, res, next) {
  if (req.params.id.match(/^[a-f0-9]{24}$/gm) === null) {
    res.status(404).end();
    return;
  }
  Task.findByIdAndDelete(req.params.id, function (err, task) {
    if (err) return next(err);
    if (task === null) {
      res.status(404).end();
      return;
    }
    res.json(task);
  });
};

exports.deleteAll = function (req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).end();
    return;
  }
  Task.deleteMany({ completed: req.body.completed }, function (err) {
    if (err) return next(err);
    res.json({ message: "Delete successful" });
  });
};
