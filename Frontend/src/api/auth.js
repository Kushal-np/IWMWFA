import axios from "axios"
export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/signin", loginData);
  return response.data;
};

export const signupUser = async (signupData) => {
  const response = await api.post("/auth/signup", signupData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/getMe"); // Changed from axios to api
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};