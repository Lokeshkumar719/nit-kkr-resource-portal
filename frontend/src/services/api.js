import axios from "axios";

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
// Create Axios instance
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Global Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access");
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
// ================= AUTH =================

export const login = (email, password) =>
  api.post("/auth/login", {
    email,
    password,
  });

export const register = (userData) =>
  api.post("/auth/register", userData);

export const verifyOTP = (email, otp) =>
  api.post("/auth/verify-otp", {
    email,
    otp,
  });

export const resendOTP = (email) =>
  api.post("/auth/resend-otp", {
    email,
  });

export const verifyAuth = () =>
  api.get("/auth/me");

export const logout = () =>
  api.post("/auth/logout");

// ================= SUBJECTS =================

export const getSubjects = (branch, semester) =>
  api.get("/subjects", {
    params: {
      ...(branch && { branch }),
      ...(semester && { semester }),
    },
  });

export const createSubject = (data) =>
  api.post("/subjects", data);

// ================= RESOURCES =================

export const getResources = (subjectId) =>
  api.get("/resources", {
    params: {
      subjectId,
    },
  });

export const uploadResource = (formData) =>
  api.post("/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteResource = (resourceId) =>
  api.delete(`/resources/${resourceId}`);

// ================= CONTRIBUTIONS =================

export const createContribution = (formData) =>
  api.post("/contributions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getContributions = () =>
  api.get("/contributions");

export const approveContribution = (contributionId) =>
  api.patch(`/contributions/${contributionId}/approve`);

export const deleteContribution = (contributionId) =>
  api.delete(`/contributions/${contributionId}`);

// ================= BUGS =================

export const createBug = (description) =>
  api.post("/bugs", {
    description,
  });

export const getBugs = () =>
  api.get("/bugs");

export const resolveBug = (bugId) =>
  api.patch(`/bugs/${bugId}/resolve`);

export const deleteBug = (bugId) =>
  api.delete(`/bugs/${bugId}`);
