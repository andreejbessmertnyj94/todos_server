const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to DB has been established successfully');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
})();

module.exports = sequelize;
