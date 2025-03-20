const express = require('express');
const { getRespostas } = require('../controllers/responseController');

const router = express.Router();

router.get('/', getRespostas);

module.exports = router;
