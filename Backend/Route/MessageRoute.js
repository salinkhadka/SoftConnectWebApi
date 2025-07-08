const express = require('express');
const router = express.Router();
const MessageController = require('../Controller/MessageController');
const { authenticateUser } = require('../middleware/AuthMiddleware');

router.get('/msg/conversations/:userId', authenticateUser, MessageController.getConversationUsers);
router.post('/send', authenticateUser, MessageController.sendMessage);
router.get('/:user1/:user2', authenticateUser, MessageController.getMessages);
router.put('/read', authenticateUser, MessageController.markAsRead);

router.get('/debug/count/:userId', authenticateUser, MessageController.debugMessagesCount);


module.exports = router;
