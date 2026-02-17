const { z } = require('zod');

const updateUserSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }).min(1, 'Name is required'),
});

module.exports = {
  updateUserSchema,
};
