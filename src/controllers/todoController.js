const { Todo } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { createTodoSchema, updateTodoSchema } = require('../validations/todo');
const { Op } = require('sequelize');

const createTodo = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = createTodoSchema.parse(req.body);

    // Create todo
    const todo = await Todo.create({
      ...validatedData,
      userId: req.user.id,
    });

    return successResponse(res, 201, { todo }, 'Todo created successfully');
  } catch (error) {
    next(error);
  }
};

const getAllTodos = async (req, res, next) => {
  try {
    const { completed, search, page = 1, limit = 10 } = req.query;

    // Build where clause
    const where = { userId: req.user.id };

    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Fetch todos
    const { count, rows: todos } = await Todo.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    return successResponse(res, 200, {
      todos,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });

    if (!todo) {
      return errorResponse(res, 404, 'Todo not found');
    }

    return successResponse(res, 200, { todo });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate request body
    const validatedData = updateTodoSchema.parse(req.body);

    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });

    if (!todo) {
      return errorResponse(res, 404, 'Todo not found');
    }

    // Check if user owns the todo
    if (todo.userId !== req.user.id) {
      return errorResponse(res, 403, "You don't have permission to access this todo");
    }

    // Update todo
    await todo.update(validatedData);

    return successResponse(res, 200, { todo }, 'Todo updated successfully');
  } catch (error) {
    next(error);
  }
};

const markAsCompleted = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });

    if (!todo) {
      return errorResponse(res, 404, 'Todo not found');
    }

    // Check if user owns the todo
    if (todo.userId !== req.user.id) {
      return errorResponse(res, 403, "You don't have permission to access this todo");
    }

    // Mark as completed
    todo.completed = true;
    await todo.save();

    return successResponse(res, 200, { todo }, 'Todo marked as completed');
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });

    if (!todo) {
      return errorResponse(res, 404, 'Todo not found');
    }

    // Check if user owns the todo
    if (todo.userId !== req.user.id) {
      return errorResponse(res, 403, "You don't have permission to access this todo");
    }

    // Delete todo
    await todo.destroy();

    return successResponse(res, 200, null, 'Todo deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  markAsCompleted,
  deleteTodo,
};
