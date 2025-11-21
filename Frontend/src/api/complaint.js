import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const createComplaint = async (formData) => {
  const response = await api.post("/complaint/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(response)
  return response.data;

};

export const getMyComplaints = async () => {
  const response = await api.get("/complaint/my-complaints");
  console.log(response.data)
  return response.data;

  
};

export const getAllComplaints = async () => {
  const response = await api.get("/complaint/all");
  return response.data;
};
