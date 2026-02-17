const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {
  successResponse,
  errorResponse,
} = require('../utils/responseFormatter');
const { registerSchema, loginSchema } = require('../validations/auth');
const { addToBlacklist } = require('../utils/tokenBlacklist');

const register = async (req, res, next) => {
  try {
    // Validate request body
    console.log(1);
    const validatedData = registerSchema.parse(req.body);
    console.log(2);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    return successResponse(
      res,
      201,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      'User registered successfully',
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ where: { email: validatedData.email } });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password,
    );
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    return successResponse(
      res,
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      'Login successful',
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Add token to blacklist
    addToBlacklist(req.token);

    return successResponse(res, 200, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
