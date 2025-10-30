import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { getApp } from 'firebase/app';
import toast from 'react-hot-toast';

export interface NotificationPreferences {
  newCompetitions: boolean;
  competitionReminders: boolean;
  partnerMatches: boolean;
  competitionUpdates: boolean;
  weeklySummary: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  weekendsOnly: boolean;
  competitionDaysOnly: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: any;
  timestamp: Date;
  read: boolean;
  type: 'competition' | 'reminder' | 'match' | 'update' | 'system';
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Default preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  newCompetitions: true,
  competitionReminders: true,
  partnerMatches: true,
  competitionUpdates: false,
  weeklySummary: true,
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00"
  },
  weekendsOnly: false,
  competitionDaysOnly: false
};

// Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Request Notification Permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Initialize Firebase Messaging
export const initializeMessaging = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (!isSupportedBrowser) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }

    const messaging = getMessaging(getApp());
    return messaging;
  } catch (error) {
    console.error('Error initializing messaging:', error);
    return null;
  }
};

// Get FCM Token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = await initializeMessaging();
    if (!messaging) return null;

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    // You'll need to add your VAPID key here
    const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
    if (!vapidKey) {
      console.warn('VAPID key not configured');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: vapidKey
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Listen for Messages
export const setupMessageListener = async (callback: (payload: any) => void) => {
  try {
    const messaging = await initializeMessaging();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);

      // Show in-app notification
      showInAppNotification(payload.notification || payload);
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
};

// Show Browser Notification
export const showBrowserNotification = async (notification: PushNotification) => {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || '/icon-192x192.png',
      badge: notification.badge || '/icon-192x192.png',
      tag: notification.tag,
      requireInteraction: notification.requireInteraction,
      data: notification.data
    };

    const browserNotification = new Notification(notification.title, options);

    // Auto-close after 5 seconds unless it requires interaction
    if (!notification.requireInteraction) {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }

    // Handle clicks
    browserNotification.onclick = () => {
      // Focus window or open new one
      window.focus();

      // Handle action based on data
      if (notification.data?.url) {
        window.location.href = notification.data.url;
      }

      browserNotification.close();
    };

    return browserNotification;
  } catch (error) {
    console.error('Error showing browser notification:', error);
  }
};

// Show In-App Notification (Toast)
export const showInAppNotification = (payload: any) => {
  const { title, body, data } = payload.notification || payload.data || {};

  if (title && body) {
    toast.success(`${title}\n${body}`, {
      duration: 5000
    });

    // Handle URL navigation separately if needed
    if (data?.url) {
      setTimeout(() => {
        // Optional: could show a follow-up toast with action
      }, 1000);
    }
  }
};

// Check if notifications are supported and enabled
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Get current notification permission status
export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
};

// Save notification preferences to localStorage
export const saveNotificationPreferences = (preferences: NotificationPreferences) => {
  localStorage.setItem('wod-notification-preferences', JSON.stringify(preferences));
};

// Load notification preferences from localStorage
export const loadNotificationPreferences = (): NotificationPreferences => {
  try {
    const saved = localStorage.getItem('wod-notification-preferences');
    if (saved) {
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading notification preferences:', error);
  }
  return DEFAULT_NOTIFICATION_PREFERENCES;
};

// Check if notification should be sent based on preferences and time
export const shouldSendNotification = (
  type: keyof NotificationPreferences,
  preferences: NotificationPreferences = loadNotificationPreferences()
): boolean => {
  // Check if this type is enabled
  if (!preferences[type as keyof NotificationPreferences]) {
    return false;
  }

  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(preferences.quietHours.start.replace(':', ''));
    const endTime = parseInt(preferences.quietHours.end.replace(':', ''));

    if (startTime < endTime) {
      // Same day range (e.g., 08:00 to 22:00)
      if (currentTime >= startTime && currentTime <= endTime) {
        return false;
      }
    } else {
      // Overnight range (e.g., 22:00 to 08:00)
      if (currentTime >= startTime || currentTime <= endTime) {
        return false;
      }
    }
  }

  // Check weekend preference
  if (preferences.weekendsOnly) {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      return false;
    }
  }

  // Check competition days only (this would need more logic based on user's competitions)
  // For now, we'll skip this check

  return true;
};

// Send notification (utility function)
export const sendNotification = async (
  type: PushNotification['type'],
  title: string,
  body: string,
  data?: any,
  requireInteraction = false
) => {
  const preferences = loadNotificationPreferences();

  if (!shouldSendNotification(type as keyof NotificationPreferences, preferences)) {
    return;
  }

  const notification: PushNotification = {
    id: Date.now().toString(),
    title,
    body,
    type,
    data,
    requireInteraction,
    timestamp: new Date(),
    read: false
  };

  // Show browser notification if permission granted
  if (getNotificationPermission() === 'granted') {
    await showBrowserNotification(notification);
  }

  // Always show in-app notification
  showInAppNotification({
    notification: {
      title,
      body,
      data
    }
  });

  // Store in local history
  saveNotificationToHistory(notification);
};

// Notification History Management
export const saveNotificationToHistory = (notification: PushNotification) => {
  try {
    const history = loadNotificationHistory();
    history.unshift(notification);

    // Keep only last 100 notifications
    if (history.length > 100) {
      history.splice(100);
    }

    localStorage.setItem('wod-notification-history', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving notification to history:', error);
  }
};

export const loadNotificationHistory = (): PushNotification[] => {
  try {
    const saved = localStorage.getItem('wod-notification-history');
    if (saved) {
      const history = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      return history.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading notification history:', error);
  }
  return [];
};

export const markNotificationAsRead = (notificationId: string) => {
  try {
    const history = loadNotificationHistory();
    const notification = history.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem('wod-notification-history', JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const clearNotificationHistory = () => {
  localStorage.removeItem('wod-notification-history');
};

// Initialize notifications on app start
export const initializeNotifications = async () => {
  // Register service worker
  await registerServiceWorker();

  // Setup message listener for foreground messages
  setupMessageListener((payload) => {
    console.log('Foreground message received:', payload);
  });

  // Check if we should request permission
  const preferences = loadNotificationPreferences();
  const permission = getNotificationPermission();

  // If user hasn't been asked yet and notifications are enabled by default, request permission
  if (permission === 'default' && preferences.newCompetitions) {
    // We'll request permission later when user interacts with the app
    console.log('Will request notification permission on user interaction');
  }
};