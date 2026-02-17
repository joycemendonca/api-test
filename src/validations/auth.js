const { z } = require('zod');

const registerSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email('Email must be a valid email address'),
  password: z.string({
    required_error: 'Password is required',
  }).min(8, 'Password must be at least 8 characters'),
  name: z.string({
    required_error: 'Name is required',
  }).min(1, 'Name is required'),
});

const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email('Email must be a valid email address'),
  password: z.string({
    required_error: 'Password is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
