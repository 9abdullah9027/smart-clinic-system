const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};