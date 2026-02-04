const notificationService = require("../services/notificationService");

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.markAsRead(notificationId);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get unread count" });
  }
};
};

exports.getProjectBlockers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const blockers = await blockerDetectionService.getProjectBlockers(projectId);
    res.json(blockers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blockers" });
  }
};

exports.resolveBlocker = async (req, res) => {
  try {
    const { blockerId } = req.params;
    const { resolution } = req.body;

    if (!resolution) {
      return res.status(400).json({ message: "Resolution description is required" });
    }

    const blocker = await blockerDetectionService.resolveBlocker(blockerId, resolution);
    res.json(blocker);
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve blocker" });
  }
};
