const { Notification } = require('electron');

class NotificationManager {
  constructor() {
    this.notifications = [];
  }

  show(title, body, options = {}) {
    if (!Notification.isSupported()) {
      console.log('Notifications not supported');
      return;
    }

    const notification = new Notification({
      title,
      body,
      icon: options.icon || null,
      silent: options.silent || false,
      hasReply: options.hasReply || false,
      timeoutType: options.timeoutType || 'default',
      urgency: options.urgency || 'normal',
    });

    notification.on('click', () => {
      if (options.onClick) {
        options.onClick();
      }
    });

    notification.on('close', () => {
      this.notifications = this.notifications.filter(n => n !== notification);
    });

    notification.show();
    this.notifications.push(notification);

    return notification;
  }

  clearAll() {
    this.notifications.forEach(notification => notification.close());
    this.notifications = [];
  }
}

module.exports = new NotificationManager();
