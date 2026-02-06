import axios from 'axios';

// Base API URL - Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          params: { refreshToken },
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ========== Authentication APIs ==========

export const authAPI = {
  // Authenticate with Clerk
  authenticateWithClerk: async (clerkData) => {
    const response = await api.post('/auth/clerk', clerkData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', null, {
      params: { refreshToken },
    });
    return response.data;
  },
};

// ========== User APIs ==========

export const userAPI = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Mark profile as completed
  markProfileCompleted: async () => {
    const response = await api.post('/users/me/complete-profile');
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },

  // Get users by city
  getUsersByCity: async (city) => {
    const response = await api.get(`/users/city/${city}`);
    return response.data;
  },
};

// ========== Match APIs ==========

export const matchAPI = {
  // Get all matches
  getMyMatches: async () => {
    const response = await api.get('/matches');
    return response.data;
  },

  // Get top matches
  getTopMatches: async (limit = 10) => {
    const response = await api.get('/matches/top', {
      params: { limit },
    });
    return response.data;
  },

  // Get mutual matches
  getMutualMatches: async () => {
    const response = await api.get('/matches/mutual');
    return response.data;
  },

  // Like/Unlike a match
  toggleLike: async (matchedUserId) => {
    const response = await api.post(`/matches/${matchedUserId}/like`);
    return response.data;
  },

  // Calculate matches (async job)
  calculateMatches: async () => {
    const response = await api.post('/matches/calculate');
    return response.data;
  },

  // Get compatibility score
  getCompatibilityScore: async (userId) => {
    const response = await api.get(`/matches/compatibility/${userId}`);
    return response.data;
  },
};

// ========== Message APIs ==========

export const messageAPI = {
  // Send message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get conversation
  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  // Get unread messages
  getUnreadMessages: async () => {
    const response = await api.get('/messages/unread');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  // Mark conversation as read
  markConversationAsRead: async (userId) => {
    const response = await api.put(`/messages/conversation/${userId}/read`);
    return response.data;
  },

  // Get conversations list
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
};

// ========== Game APIs ==========

export const gameAPI = {
  // Get all questions
  getQuestions: async () => {
    const response = await api.get('/game/questions');
    return response.data;
  },

  // Submit single answer
  submitAnswer: async (answerData) => {
    const response = await api.post('/game/answers', answerData);
    return response.data;
  },

  // Submit multiple answers
  submitAnswers: async (answers) => {
    const response = await api.post('/game/answers/bulk', answers);
    return response.data;
  },

  // Check if completed
  hasCompletedQuestions: async () => {
    const response = await api.get('/game/completed');
    return response.data;
  },
};

// ========== Image Upload APIs ==========

export const imageAPI = {
  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (publicId) => {
    const response = await api.delete('/upload', {
      params: { publicId },
    });
    return response.data;
  },
};

// ========== WebSocket Connection ==========

export const createWebSocketConnection = (token) => {
  const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
  
  // Use SockJS and STOMP for WebSocket connection
  // Install: npm install sockjs-client @stomp/stompjs
  // Example usage in a component:
  /*
  import SockJS from 'sockjs-client';
  import { Stomp } from '@stomp/stompjs';
  
  const socket = new SockJS(WS_URL);
  const stompClient = Stomp.over(socket);
  
  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    (frame) => {
      console.log('Connected to WebSocket');
      
      // Subscribe to personal message queue
      stompClient.subscribe('/user/queue/messages', (message) => {
        const messageData = JSON.parse(message.body);
        console.log('Received message:', messageData);
      });
      
      // Send message
      stompClient.send('/app/chat.send', {}, JSON.stringify({
        receiverId: userId,
        content: 'Hello!',
        messageType: 'TEXT'
      }));
    },
    (error) => {
      console.error('WebSocket connection error:', error);
    }
  );
  */
  
  return WS_URL;
};

export default api;
