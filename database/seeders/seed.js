require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Todo } = require('../../src/models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync database (force: true will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized (tables recreated).');

    // Create test users
    const password = await bcrypt.hash('password123', 10);

    const users = await User.bulkCreate([
      {
        email: 'tester1@example.com',
        password,
        name: 'Tester One',
      },
      {
        email: 'tester2@example.com',
        password,
        name: 'Tester Two',
      },
      {
        email: 'tester3@example.com',
        password,
        name: 'Tester Three',
      },
    ]);

    console.log('Test users created.');

    // Create sample todos
    const todos = [
      // User 1 todos
      {
        userId: users[0].id,
        title: 'Complete API testing workshop',
        description: 'Learn about different testing scenarios and HTTP methods',
        completed: false,
      },
      {
        userId: users[0].id,
        title: 'Write test cases for authentication',
        description: 'Cover positive and negative scenarios for login and registration',
        completed: true,
      },
      {
        userId: users[0].id,
        title: 'Test pagination endpoints',
        description: null,
        completed: false,
      },
      {
        userId: users[0].id,
        title: 'Validate error responses',
        description: 'Check that all error endpoints return proper status codes and messages',
        completed: true,
      },
      // User 2 todos
      {
        userId: users[1].id,
        title: 'Review API documentation',
        description: 'Go through the README and understand all available endpoints',
        completed: false,
      },
      {
        userId: users[1].id,
        title: 'Test boundary conditions',
        description: 'Test maximum length for title and description fields to ensure validation works correctly',
        completed: false,
      },
      {
        userId: users[1].id,
        title: 'Verify JWT token expiration',
        description: 'Test what happens when using an expired token',
        completed: true,
      },
      // User 3 todos
      {
        userId: users[2].id,
        title: 'Test cross-user authorization',
        description: 'Ensure users cannot access or modify todos belonging to other users',
        completed: false,
      },
      {
        userId: users[2].id,
        title: 'Practice filtering and search',
        description: 'Test the completed filter and title search functionality',
        completed: false,
      },
      {
        userId: users[2].id,
        title: 'Short todo',
        description: 'A',
        completed: true,
      },
    ];

    await Todo.bulkCreate(todos);
    console.log('Sample todos created.');

    console.log('\n==============================================');
    console.log('Database seeded successfully!');
    console.log('==============================================');
    console.log('\nTest user credentials:');
    console.log('- Email: tester1@example.com | Password: password123');
    console.log('- Email: tester2@example.com | Password: password123');
    console.log('- Email: tester3@example.com | Password: password123');
    console.log('==============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
