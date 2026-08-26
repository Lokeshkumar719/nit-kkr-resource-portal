import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/refresh-token') {
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
        await api.post('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null, 'Success');
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);

        localStorage.removeItem('nitkkr_user');

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data), // My original signup route just in case
  checkSession: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const login = (email, password) => api.post('/auth/login', { email, password });

export const register = (email, password) => api.post('/auth/register', { email, password });

export const verifyOTP = (email, otp) => api.post('/auth/verify-otp', { email, otp });

export const resendOTP = (email) => api.post('/auth/resend-otp', { email });

export const verifyAuth = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const verifyForgotPasswordOTP = (email, otp) =>
  api.post('/auth/verify-forgot-password-otp', { email, otp });

export const resetPassword = (email, otp, password) =>
  api.post('/auth/reset-password', { email, otp, password });

export const changePassword = (oldPassword, newPassword) =>
  api.patch('/auth/change-password', { oldPassword, newPassword });

export const getSubjects = (semester, branch) =>
  api.get('/subjects', {
    params: {
      ...(semester && { semester }),
      ...(branch && { branch }),
    },
  });

export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.patch(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

export const getResources = (subjectId) =>
  api.get('/resources', {
    params: {
      subjectId,
    },
  });

export const uploadResource = (formData) => api.post('/resources', formData);

export const getResourceDownloadUrl = (resourceId) => api.get(`/resources/${resourceId}/download`);

export const deleteResource = (resourceId) => api.delete(`/resources/${resourceId}`);

export const updateResource = (resourceId, data) => api.patch(`/resources/${resourceId}`, data);

export const resourceApi = {
  getByBranchAndSem: (branch, sem) => getSubjects(sem, branch),
  getAll: () => api.get('/resources'), // Backup
};

export const getMentors = (year, branch) =>
  api.get('/mentors', { params: { currentYear: year, branch } });
export const createMentor = (data) => api.post('/mentors', data);
export const updateMentor = (id, data) => api.patch(`/mentors/${id}`, data);
export const deleteMentor = (id) => api.delete(`/mentors/${id}`);

export const seniorApi = {
  getByYearAndBranch: (year, branch) =>
    api.get('/mentors', { params: { currentYear: year, branch } }),
};

export const alumniApi = {
  getAll: (branch) => api.get('/alumni', { params: { branch } }),
};

export const createContribution = (formData) => api.post('/contributions', formData);

export const getContributions = (params) => api.get('/contributions', { params });
export const approveContribution = (id) => api.patch(`/contributions/${id}/approve`);
export const rejectContribution = (id) => api.delete(`/contributions/${id}`);
export const updateContribution = (id, data) => api.patch(`/contributions/${id}`, data);
export const getContributionDownloadUrl = (id) => api.get(`/contributions/${id}/download`);

export const createBug = (formData) => {
  if (formData instanceof FormData) {
    return api.post('/bugs', formData);
  }
  return api.post('/bugs', { description: formData }); // Fallback
};

export const getBugs = (params) => api.get('/bugs', { params });

export const resolveBug = (bugId) => api.patch(`/bugs/${bugId}/resolve`);

export const deleteBug = (bugId) => api.delete(`/bugs/${bugId}`);

export const getBugDownloadUrl = (bugId) => api.get(`/bugs/${bugId}/download`);

export const contributionApi = {
  submit: (formData) => {
    if (formData instanceof FormData) {
      return createContribution(formData);
    } else {
      if (formData.type === 'bug') {
        const bugFormData = new FormData();
        bugFormData.append('description', formData.description);
        if (formData.file) {
          bugFormData.append('file', formData.file);
        }
        return createBug(bugFormData);
      }
    }
    return Promise.reject('Invalid contribution type');
  },
};
