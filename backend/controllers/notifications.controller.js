// src/controllers/notifications.controller.js
import User from '../models/User.js';

export const sendNotificationToAll = async (req, res) => {
    const { title, description, link } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const users = await User.find({});
        const notification = { title, description, link, seen: false, createdAt: new Date() };

        await Promise.all(
            users.map(user => {
                user.notifications.push(notification);
                return user.save();
            })
        );

        res.status(200).json({ message: 'Notification sent to all users' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/notifications/clear-all
// Clears notifications for all users
export const clearAllNotifications = async (req, res) => {
    try {
        // Update all users: set notifications array to empty
        await User.updateMany({}, { $set: { notifications: [] } });

        res.status(200).json({ message: "All notifications cleared for all users." });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// PATCH /api/notifications/mark-seen
export const markAllNotificationsSeen = async (req, res) => {
  try {
    const { userId } = req.body; // user ID sent from client

    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Mark all notifications as seen
    user.notifications = user.notifications.map((n) => ({
      ...n.toObject(),
      seen: true,
    }));

    await user.save();

    res.status(200).json({ message: 'All notifications marked as seen' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};