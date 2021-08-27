const { Task, TaskValidator } = require('./model');

exports.create = async (req, res, next) => {
  try {
    const { content } = req.body;

    await TaskValidator.validateAsync({ content });
    const dbTask = await Task.create({ content, UserId: req.token.UserId });

    const result = {
      completed: dbTask.completed,
      id: dbTask.id,
      content: dbTask.content,
    };

    res.status(201).json({ message: 'Create successful', data: [result] });
  } catch (err) {
    return next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: {
        UserId: req.token.UserId,
      },
      attributes: ['completed', 'id', 'content'],
    });

    res.json({ message: 'Fetch successful', data: tasks });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { completed, content } = req.body;

    await TaskValidator.fork('content', (schema) =>
      schema.optional()
    ).validateAsync({ content, completed });
    const result = await Task.update(
      { completed, content },
      {
        where: {
          UserId: req.token.UserId,
          id: req.params.id,
        },
        returning: ['completed', 'id', 'content'],
      }
    );

    if (!result[1].length) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Update successful', data: result[1] });
  } catch (err) {
    return next(err);
  }
};

exports.updateAll = async (req, res, next) => {
  try {
    const { completed, content } = req.body;

    await TaskValidator.fork('content', (schema) =>
      schema.optional()
    ).validateAsync({
      content,
      completed,
    });
    await Task.update(
      { completed, content },
      { where: { UserId: req.token.UserId, completed: !completed } }
    );

    res.json({ message: 'Update successful' });
  } catch (err) {
    return next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await Task.destroy({
      where: {
        UserId: req.token.UserId,
        id: req.params.id,
      },
    });

    if (!result) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ message: 'Delete successful' });
  } catch (err) {
    return next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Task.destroy({
      where: {
        UserId: req.token.UserId,
        completed: req.body.completed,
      },
    });

    res.json({ message: 'Delete successful' });
  } catch (err) {
    return next(err);
  }
};
