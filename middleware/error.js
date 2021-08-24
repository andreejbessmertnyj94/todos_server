const errorHandler = function (err, req, res, next) {
  switch (err.name) {
    case 'UnauthorizedError':
    case 'TokenExpiredError':
      res.status(401).json({ message: 'Please log in again.' });
      break;
    case 'AuthorizationError':
    case 'MongoError':
      res.status(400).json({ message: err.message });
      break;
    case 'JsonWebTokenError':
    case 'SyntaxError':
      res.status(403).json({ message: 'Forbidden' });
      break;
    case 'CastError':
      res.status(400).json({ message: 'Bad request' });
      break;
    case 'ValidationError':
      const userMessage = Object.values(err.errors).map((elem) => elem.message);
      res.status(400).json({ message: userMessage.join(' ') });
      break;
    case 'MongooseServerSelectionError':
      res.status(503).json({ message: 'Service Unavailable' });
      break;
    default:
      res.status(500).json({ message: 'Internal Server Error' });
  }
  console.error(err.name + ' - ' + err.message);
};

module.exports = errorHandler;
