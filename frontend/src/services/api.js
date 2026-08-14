import axios from "axios";

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