// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

export const API_ENDPOINTS = {
  // Admin endpoints
  admin: {
    login: `${API_BASE_URL}/api/admin/login`,
    dashboard: `${API_BASE_URL}/api/admin/dashboard`,
    users: `${API_BASE_URL}/api/admin/users`,
    services: `${API_BASE_URL}/api/admin/services`,
    employees: `${API_BASE_URL}/api/admin/employees`,
    leads: `${API_BASE_URL}/api/admin/leads`,
    wallet: `${API_BASE_URL}/api/admin/wallet`,
  },
  
  // Customer endpoints
  customer: {
    login: `${API_BASE_URL}/api/customers/user-login`,
    register: `${API_BASE_URL}/api/customers/google-register`,
    dashboard: `${API_BASE_URL}/api/customers/cdashboard`,
    services: `${API_BASE_URL}/api/customers/user-services`,
    upload: `${API_BASE_URL}/api/customers/upload-documents`,
    queries: `${API_BASE_URL}/api/customers/queries`,
  },
  
  // Employee endpoints
  employee: {
    login: `${API_BASE_URL}/api/employees/login`,
    dashboard: `${API_BASE_URL}/api/employees/emdashboard`,
    customers: `${API_BASE_URL}/api/employees/assigned-customers`,
    leads: `${API_BASE_URL}/api/employees/assigned-leads`,
    queries: `${API_BASE_URL}/api/employees/queries`,
    profile: `${API_BASE_URL}/api/employees/update-employee-profile`,
  },
  
  // Messages endpoints
  messages: {
    base: `${API_BASE_URL}/api/messages`,
    send: `${API_BASE_URL}/api/messages/send`,
    markAsRead: `${API_BASE_URL}/api/messages/mark-as-read`,
  }
};