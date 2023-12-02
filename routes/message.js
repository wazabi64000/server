// routes/messageRoute.js
import express from 'express';
const router = express.Router();

const { createMessage, getReceivedMessagesByUser, markMessageAsRead ,getAllReceivedMessages
} = require('../controllers/messageController.js');

// Create a new message
router.post('/messages/send', createMessage);

// Get all received messages
router.get('/messages/received', getAllReceivedMessages);

// Get received messages for a specific user
router.get('/messages/received/:userId', getReceivedMessagesByUser);

// Mark a message as read
router.patch('/messages/mark-as-read/:messageId', markMessageAsRead);

export default router;
