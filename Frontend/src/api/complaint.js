import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Create complaint
export const createComplaint = async (formData) => {
  const response = await api.post("/complaint/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update complaint status
export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaint/status/${id}`, { status });
  return response.data;
};

// Get user's complaints
export const getMyComplaints = async () => {
  const response = await api.get("/complaint/my-complaints");
  return response.data;
};

// Get all complaints (admin)
export const getAllComplaints = async () => {
  const response = await api.get("/complaint/all");
  return response.data;
};
