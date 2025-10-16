// Application constants
export const ROLES = {
  APPLICANT: 'applicant',
  ADMIN: 'admin',
  BOT: 'bot'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
};

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  JOBS: {
    ACTIVE: '/jobs/active',
    BY_ID: (id) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`
  },
  APPLICATIONS: {
    SUBMIT: '/applications',
    MY_APPLICATIONS: '/applications/my-applications',
    ALL: '/applications/all',
    BY_ID: (id) => `/applications/${id}`,
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
    ADD_NOTE: (id) => `/applications/${id}/notes`
  },
  ADMIN: {
    USERS: '/admin/users',
    TOGGLE_USER: (id) => `/admin/users/${id}/activate`,
    CREATE_BOT_USER: '/admin/users/bots'
  },
  AUDIT: '/audit',
  BOT: {
    DASHBOARD: '/bot/dashboard'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  ADMIN: '/admin',
  BOT: '/bot',
  UNAUTHORIZED: '/unauthorized'
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  COVER_LETTER_MIN_LENGTH: 100
};

export default {
  ROLES,
  APPLICATION_STATUS,
  JOB_TYPES,
  API_ENDPOINTS,
  ROUTES,
  VALIDATION_RULES
};
