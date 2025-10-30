import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  sendNotification,
  loadNotificationHistory,
  markNotificationAsRead
} from '../services/notification.service';
import type { NotificationPreferences, PushNotification } from '../services/notification.service';

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications on mount
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = () => {
    try {
      const history = loadNotificationHistory();
      setNotifications(history);
      setUnreadCount(history.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const sendWelcomeNotification = () => {
    if (!currentUser) return;

    sendNotification(
      'system',
      '¡Bienvenido a WOD Colombia! 🏋️‍♀️',
      'Tu perfil está listo. Completa tu información para recibir recomendaciones personalizadas.',
      { url: `/profile/${currentUser.uid}` }
    );
  };

  const sendCompetitionReminder = (competitionName: string, competitionDate: string) => {
    sendNotification(
      'reminder',
      '⏰ Recordatorio de competencia',
      `Tu competencia "${competitionName}" es ${competitionDate}. ¡Prepárate!`,
      { url: '/my-competitions' }
    );
  };

  const sendNewCompetitionNotification = (competitionName: string, location: string) => {
    sendNotification(
      'competition',
      '🏆 Nueva competencia disponible',
      `"${competitionName}" en ${location}. ¡Regístrate ahora!`,
      { url: '/' }
    );
  };

  const sendPartnerMatchNotification = (partnerName: string) => {
    sendNotification(
      'match',
      '🤝 ¡Nuevo match en Partner Finder!',
      `${partnerName} quiere entrenar contigo. ¡Conecta ahora!`,
      { url: '/partner-finder' }
    );
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    sendWelcomeNotification,
    sendCompetitionReminder,
    sendNewCompetitionNotification,
    sendPartnerMatchNotification,
    refreshNotifications: loadNotifications
  };
};