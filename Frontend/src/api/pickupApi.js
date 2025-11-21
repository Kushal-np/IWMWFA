import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
     withCredentials: true,
});

export const createPickupRequest = async (data) => {
  const response = await api.post(`/business/request-pickup`, data, {
    withCredentials: true,
  });
  return response.data;
};


