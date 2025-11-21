import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Products
  products: [],
  selectedProduct: null,
  myListings: [],
  loading: false,
  error: null,

  // Cart
  cart: null,
  cartItems: [],

  // Orders
  myOrders: [],
  mySales: [],

  // Filters
  filters: {
    search: "",
    category: "",
    listingType: "",
    minPrice: 0,
    maxPrice: 100000,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Products
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setMyListings: (state, action) => {
      state.myListings = action.payload;
    },
    addListing: (state, action) => {
      state.myListings.push(action.payload);
    },
    removeListing: (state, action) => {
      state.myListings = state.myListings.filter(
        (p) => p._id !== action.payload
      );
    },

    // Cart
    setCart: (state, action) => {
      state.cart = action.payload;
      state.cartItems = action.payload?.items || [];
    },
    clearCartState: (state) => {
      state.cart = null;
      state.cartItems = [];
    },

    // Orders
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    setMySales: (state, action) => {
      state.mySales = action.payload;
    },
    addOrder: (state, action) => {
      state.myOrders.push(action.payload);
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  setSelectedProduct,
  setMyListings,
  addListing,
  removeListing,
  setCart,
  clearCartState,
  setMyOrders,
  setMySales,
  addOrder,
  setFilters,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;