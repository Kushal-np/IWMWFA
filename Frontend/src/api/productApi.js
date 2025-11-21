import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// ============ PRODUCTS ============

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get("/products/my-listings");
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post("/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ============ CART ============

export const getCart = async () => {
  const response = await api.get("/products/cart/get");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/products/cart/add", {
    productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put("/products/cart/update", {
    productId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/products/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/products/cart/clear");
  return response.data;
};

// ============ ORDERS ============

export const createOrder = async (deliveryAddress, contactNumber, notes = "") => {
  const response = await api.post("/products/orders/create", {
    deliveryAddress,
    contactNumber,
    notes,
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/products/orders/my-orders");
  return response.data;
};

export const getMySales = async () => {
  const response = await api.get("/products/orders/my-sales");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/products/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/products/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};