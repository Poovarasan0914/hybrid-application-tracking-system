import { ROLES } from './constants';

// Permission checking utilities
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

export const hasAnyRole = (userRole, requiredRoles) => {
  if (!userRole || !Array.isArray(requiredRoles)) return false;
  return requiredRoles.includes(userRole);
};

export const hasAdminAccess = (userRole) => {
  return hasRole(userRole, ROLES.ADMIN);
};

export const hasBotAccess = (userRole) => {
  return hasRole(userRole, ROLES.BOT);
};

export const hasAdminOrBotAccess = (userRole) => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.BOT]);
};

export const canManageUsers = (userRole) => {
  return hasRole(userRole, ROLES.ADMIN);
};

export const canManageJobs = (userRole) => {
  return hasRole(userRole, ROLES.ADMIN);
};

export const canViewAllApplications = (userRole) => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.BOT]);
};

export const canUpdateApplicationStatus = (userRole) => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.BOT]);
};

export const canAddApplicationNotes = (userRole) => {
  return hasAnyRole(userRole, [ROLES.ADMIN, ROLES.BOT]);
};

export const canViewAuditLogs = (userRole) => {
  return hasRole(userRole, ROLES.ADMIN);
};

export const canAccessBotDashboard = (userRole) => {
  return hasRole(userRole, ROLES.BOT);
};

// Role hierarchy for permission checking
export const getRoleHierarchy = (role) => {
  const hierarchy = {
    [ROLES.APPLICANT]: 1,
    [ROLES.BOT]: 2,
    [ROLES.ADMIN]: 3
  };
  return hierarchy[role] || 0;
};

export const hasHigherOrEqualRole = (userRole, requiredRole) => {
  return getRoleHierarchy(userRole) >= getRoleHierarchy(requiredRole);
};

export default {
  hasRole,
  hasAnyRole,
  hasAdminAccess,
  hasBotAccess,
  hasAdminOrBotAccess,
  canManageUsers,
  canManageJobs,
  canViewAllApplications,
  canUpdateApplicationStatus,
  canAddApplicationNotes,
  canViewAuditLogs,
  canAccessBotDashboard,
  getRoleHierarchy,
  hasHigherOrEqualRole
};
