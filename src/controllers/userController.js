const { User, Todo } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { updateUserSchema } = require('../validations/user');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = updateUserSchema.parse(req.body);

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Update only name
    user.name = validatedData.name;
    await user.save();

    return successResponse(res, 200, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Delete user (todos will be cascade deleted)
    await user.destroy();

    return successResponse(res, 200, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
