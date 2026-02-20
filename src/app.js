require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const requestMetadata = require('./middlewares/requestMetadata');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todos');
const errorRoutes = require('./routes/errors');
const healthRoutes = require('./routes/health');

const app = express();

// Load Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestMetadata);

// Swagger documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'TODO API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/errors', errorRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
