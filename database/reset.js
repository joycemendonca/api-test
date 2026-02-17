require('dotenv').config();
const { sequelize } = require('../src/models');
const { exec } = require('child_process');
const path = require('path');

const reset = async () => {
  try {
    console.log('Resetting database...');
    
    // Drop all tables
    await sequelize.drop();
    console.log('All tables dropped.');
    
    // Run migrations
    await sequelize.sync();
    console.log('Tables recreated.');
    
    // Run seed
    console.log('\nRunning seed script...');
    exec(`node ${path.join(__dirname, 'seeders', 'seed.js')}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error running seed:', error);
        process.exit(1);
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

reset();
