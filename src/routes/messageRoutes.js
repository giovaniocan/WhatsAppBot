const express = require('express');
const { sendMessages } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', sendMessages);

module.exports = router;
