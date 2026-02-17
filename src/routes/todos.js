const express = require('express');
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  markAsCompleted,
  deleteTodo,
} = require('../controllers/todoController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// All todo routes require authentication
router.use(authMiddleware);

router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.patch('/:id/complete', markAsCompleted);
router.delete('/:id', deleteTodo);

module.exports = router;
