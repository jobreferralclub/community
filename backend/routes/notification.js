// src/routes/notifications.js
import express from 'express';
import { clearAllNotifications, markAllNotificationsSeen, sendNotificationToAll } from '../controllers/notifications.controller.js';

const router = express.Router();

// POST /api/notifications/send-to-all – Send a notification to all users
router.post('/send-to-all', sendNotificationToAll);
router.delete("/clear-all", clearAllNotifications);
router.patch('/mark-seen', markAllNotificationsSeen);

export default router;
