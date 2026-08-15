import axios from "axios";

// Axios instance
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept on login, refresh token, or session check routes to prevent infinite loops / unwanted redirects
    if (
      originalRequest.url === "/auth/login" ||
      originalRequest.url === "/auth/refresh-token" ||
      originalRequest.url === "/auth/me"
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh-token");
        isRefreshing = false;
        processQueue(null, "Success");
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        
        // If refresh token fails (expired/invalid), clear cached user
        localStorage.removeItem("nitkkr_user");
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data), // My original signup route just in case
  checkSession: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const verifyOTP = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

export const resendOTP = (email) =>
  api.post("/auth/resend-otp", { email });

export const verifyAuth = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");

// ── Subjects / Branches API ──────────────────────
export const getSubjects = (semester,branch) =>
  api.get("/subjects", {
    params: {
      ...(semester && { semester }),
      ...(branch && { branch }),
    },
  });

export const createSubject = (data) => api.post("/subjects", data);

// ── Resources API ──────────────────────
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

export const getResourceDownloadUrl = (resourceId) =>
  api.get(`/resources/${resourceId}/download`);

export const deleteResource = (resourceId) =>
  api.delete(`/resources/${resourceId}`);

// For my old premium UI compatibility:
export const resourceApi = {
  getByBranchAndSem: (branch, sem) => getSubjects(sem, branch),
  getAll: () => api.get('/resources'), // Backup
};

// ── Seniors / Mentors API ──────────────────────
export const seniorApi = {
  getByFilter: (year, branch) => api.get('/mentors', { params: { currentYear: year, branch } }),
  getByYearAndBranch: (year, branch) => api.get('/mentors', { params: { currentYear: year, branch } }),
};

// ── Alumni API ──────────────────────
export const alumniApi = {
  getAll: (branch) => api.get('/alumni', { params: { branch } }),
};

// ── Contributions API ──────────────────────
export const createContribution = (formData) =>
  api.post("/contributions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getContributions = (params) =>
  api.get("/contributions", { params });
export const approveContribution = (id) =>
  api.patch(`/contributions/${id}/approve`);
export const rejectContribution = (id) => api.delete(`/contributions/${id}`);
export const getContributionDownloadUrl = (id) =>
  api.get(`/contributions/${id}/download`);

// ── Bugs API ──────────────────────
export const createBug = (description) =>
  api.post("/bugs", {
    description,
  });

export const getBugs = () => api.get("/bugs");

export const resolveBug = (bugId) => api.patch(`/bugs/${bugId}/resolve`);

export const deleteBug = (bugId) => api.delete(`/bugs/${bugId}`);

// Old API object for my premium UI compatibility
export const contributionApi = {
  submit: (formData) => {
    // Determine if it's bug or resource based on what the UI passes
    if (formData instanceof FormData) {
      return createContribution(formData);
    } else {
      if (formData.type === 'bug') {
        return createBug(formData.description);
      }
    }
    return Promise.reject("Invalid contribution type");
  }
};
