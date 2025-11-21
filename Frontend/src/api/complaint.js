import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// ===============================
// Complaint APIs
// ===============================

// Create complaint with image upload
export const createComplaint = async (formData) => {
  const response = await api.post("/api/complaints/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Get logged-in user's complaints
export const getMyComplaints = async () => {
  const response = await api.get("/api/complaints/my-complaints");
  return response.data;
};

// Get all complaints (admin only)
export const getAllComplaints = async () => {
  const response = await api.get("/api/complaints/all");
  return response.data;
};
