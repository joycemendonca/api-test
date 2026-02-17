require('dotenv').config();
const { sequelize } = require('../src/models');

const migrate = async () => {
  try {
    console.log('Running database migrations...');
    
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync({ alter: true });
    console.log('Database tables created/updated successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

migrate();
