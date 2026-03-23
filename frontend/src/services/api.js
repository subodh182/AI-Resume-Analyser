import axios from 'axios';

// API Base URL - fallback to localhost if env var not set
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
console.log('🔗 API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // ✅ IMPORTANT: Enable credentials for CORS
  timeout: 30000 // ✅ 30 second timeout
});

// Request Interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          console.log('🔒 Unauthorized - Redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && 
              window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.error('🚫 Forbidden:', data.message);
          break;
          
        case 404:
          // Not Found
          console.error('❌ Not Found:', data.message);
          break;
          
        case 500:
          // Server Error
          console.error('💥 Server Error:', data.message);
          break;
          
        default:
          console.error(`❌ Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('📡 Network Error - No response from server');
      console.error('Please check if backend is running');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// =============================================
// AUTH APIs
// =============================================
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// =============================================
// RESUME APIs
// =============================================
export const uploadResume = (formData) => api.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getResumes = () => api.get('/resume');
export const getResumeById = (id) => api.get(`/resume/${id}`);
export const deleteResume = (id) => api.delete(`/resume/${id}`);
export const analyzeResume = (id) => api.get(`/resume/${id}/analyze`);

// =============================================
// JOB APIs
// =============================================
export const getJobs = (params = {}) => api.get('/jobs', { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const searchJobs = (query) => api.get(`/jobs/search?query=${query}`);
export const applyToJob = (jobId, data) => api.post(`/jobs/${jobId}/apply`, data);

// =============================================
// JOB MATCH APIs (NEW)
// =============================================
export const analyzeJobMatch = (data) => api.post('/job-match/analyze', data);

// =============================================
// RESUME SUMMARY GENERATOR APIs (NEW)
// =============================================
export const generateSummary = (data) => api.post('/ai/generate-summary', data);
export const regenerateSummary = (data) => api.post('/ai/regenerate-summary', data);

// =============================================
// RESUME RANKING APIs (NEW)
// =============================================
export const rankResumes = (resumeIds) => api.post('/resume/rank', { resumeIds });
export const compareResumes = (resumeIds) => api.post('/resume/compare', { resumeIds });

// =============================================
// AI INTERVIEW QUESTIONS APIs (NEW)
// =============================================
export const generateInterviewQuestions = (data) => api.post('/ai/interview-questions', data);
export const getQuestionsByDifficulty = (difficulty) => api.get(`/ai/interview-questions?difficulty=${difficulty}`);
export const getQuestionsBySkill = (skill) => api.get(`/ai/interview-questions?skill=${skill}`);

// =============================================
// DASHBOARD APIs
// =============================================
export const getDashboardStats = () => api.get('/users/dashboard/stats');
export const getActivities = (limit = 10) => api.get(`/users/activities?limit=${limit}`);

// =============================================
// PROFILE APIs
// =============================================
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const uploadProfilePhoto = (formData) => api.post('/users/profile/photo', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// =============================================
// APPLICATION APIs
// =============================================
export const getApplications = () => api.get('/applications');
export const createApplication = (data) => api.post('/applications', data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const addInterview = (id, data) => api.post(`/applications/${id}/interview`, data);

// =============================================
// ANALYTICS APIs (Future)
// =============================================
export const getResumeAnalytics = (id) => api.get(`/analytics/resume/${id}`);
export const getTrends = (period = '30days') => api.get(`/analytics/trends?period=${period}`);
export const getSkillsDemand = () => api.get('/analytics/skills-demand');

// =============================================
// NOTIFICATIONS APIs (Future)
// =============================================
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.post(`/notifications/mark-read/${id}`);
export const clearAllNotifications = () => api.delete('/notifications/clear-all');

// =============================================
// EXPORT DEFAULT
// =============================================
export default api;
