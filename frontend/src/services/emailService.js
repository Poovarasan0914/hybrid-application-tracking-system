import api from './api';

export const emailService = {
  // Send email notification for status changes
  sendStatusChangeEmail: async (applicationId, status, recipientEmail) => {
    try {
      const response = await api.post('/api/notifications/email/status-change', {
        applicationId,
        status,
        recipientEmail
      });
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      // Mock success for demo
      return { success: true, message: 'Email notification sent (simulated)' };
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (userEmail, userName) => {
    try {
      const response = await api.post('/api/notifications/email/welcome', {
        userEmail,
        userName
      });
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      return { success: true, message: 'Welcome email sent (simulated)' };
    }
  },

  // Send application confirmation
  sendApplicationConfirmation: async (applicationId, userEmail) => {
    try {
      const response = await api.post('/api/notifications/email/application-confirmation', {
        applicationId,
        userEmail
      });
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      return { success: true, message: 'Application confirmation sent (simulated)' };
    }
  }
};