const express = require('express');
const {
  error400,
  error401,
  error403,
  error404,
  error500,
  delayedResponse,
} = require('../controllers/errorController');

const router = express.Router();

router.get('/400', error400);
router.get('/401', error401);
router.get('/403', error403);
router.get('/404', error404);
router.get('/500', error500);
router.get('/delay', delayedResponse);

module.exports = router;
