// adminApi.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// GET dashboard data
export const getDashboardData = async () => {
  const response = await api.get("/admin/dashboard-data");
  return response.data;
};

export const getAllComplaints = async() =>{
    const response = await api.get("/complaint/all")
    return response.data
}
export const getAllPickupRequest = async() =>{
    const response = await api.get("/business/request-pickup")
    return response.data ; 
}

// ADD Truck
export const addTruck = async (truckData) => {
  const response = await api.post("/admin/add-truck", truckData);
  return response.data;
};

// ADD Route
export const addRoute = async (routeData) => {
  const response = await api.post("/admin/add-route", routeData);
  return response.data;
};

// GET all users
export const getAllUsersAdmin = async (query = {}) => {
  const response = await api.get("/admin/all-users", { params: query });
  return response.data;
};
