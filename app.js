if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const port = process.env.PORT;
require('./middleware/db');

const tasksRouter = require('./modules/tasks/route');
const usersRouter = require('./modules/users/route');
const auth = require('./middleware/auth');
const error = require('./middleware/error');

const app = express();

process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/users', usersRouter);
app.use('/tasks', auth, tasksRouter);

// Error handling
app.use(error);

const server = app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
