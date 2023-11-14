// src/services/authService.js
import { isAuthenticated, userProfile } from '../stores/authStore.js';

async function login() {
  // Redirect to your server's login endpoint
  window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
}

async function logout() {
  // Handle logout logic (e.g., clear session, redirect)
  isAuthenticated.set(false);
  userProfile.set(null);
  window.location.href = '/';
}

async function checkAuth() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/validate-session`, {
      credentials: 'include', // to include cookies
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Session data:', data);
      if (data.authenticated) {
        isAuthenticated.set(true);
        userProfile.set(data.user);
      } else {
        isAuthenticated.set(false);
        userProfile.set(null);
      }
    } else {
      throw new Error('Failed to validate session');
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    isAuthenticated.set(false);
    userProfile.set(null);
  }
}


export { login, logout, checkAuth };
