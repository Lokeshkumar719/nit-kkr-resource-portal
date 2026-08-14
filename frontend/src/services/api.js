import axios from 'axios';

// Axios instance — uses Vite proxy for /api
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // HttpOnly cookie auth
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, try refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear local state
        localStorage.removeItem('nitkkr_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth API helpers ──────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// ── Resource API helpers ──────────────────
// NOTE: these endpoints are not yet wired on the backend
// (resourceService.js exists but has no controller/route).
// Calls will 404 until that's added. Frontend is built correctly
// against the expected contract so it works the moment the
// backend routes land — nothing here needs to change then.
export const resourceApi = {
  getByBranchAndSem: (branch, sem) => api.get('/resources', { params: { branch, sem } }),
  getAll: () => api.get('/resources/all'),
  createSubject: (data) => api.post('/resources', data),
  addMaterial: (data) => api.post('/resources', { action: 'add_material', ...data }),
};

// ── Senior/Alumni (Mentor) API helpers ────
// Also not yet wired on the backend (seniorService.js has no
// controller/route, and its filter uses `category` while the
// Mentor model's real field is `year` — a backend-side bug).
// Frontend helpers use `year`, matching the model's actual contract.
export const seniorApi = {
  getByYearAndBranch: (year, branch) => api.get('/seniors', { params: { year, branch } }),
  create: (data) => api.post('/seniors', data),
};

// ── Contribution API helpers ──────────────
// Also not yet wired on the backend (contributionService.js has
// no controller/route).
export const contributionApi = {
  submit: (data) => api.post('/contributions', data),
  getByStatus: (status) => api.get('/contributions', { params: { status } }),
  updateStatus: (id, status) => api.put(`/contributions/${id}`, { status }),
};