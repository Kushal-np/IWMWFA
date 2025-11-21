// authSlice.js - Cookie-based authentication
import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage (only user data, not token)
const loadState = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return {
        user: null,
      };
    }
    return {
      user: JSON.parse(serializedUser),
    };
  } catch (err) {
    return {
      user: null,
    };
  }
};

// Save user to localStorage
const saveUser = (user) => {
  try {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem('user', serializedUser);
  } catch (err) {
    console.error('Could not save user', err);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadState(), // Load from localStorage on initialization
  reducers: {
    setUser: (state, action) => {
      // For cookie-based auth, we only store user data, not token
      state.user = action.payload.user;
      // Save user to localStorage for persistence
      saveUser(action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      // Clear localStorage on logout
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
