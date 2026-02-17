const { z } = require('zod');

const createTodoSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }).max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  completed: z.boolean().optional(),
});

const updateTodoSchema = z.object({
  title: z.string().max(100, 'Title must be 100 characters or less').optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  completed: z.boolean().optional(),
});

module.exports = {
  createTodoSchema,
  updateTodoSchema,
};
