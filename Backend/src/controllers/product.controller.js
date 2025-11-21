import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import cloudinary from "../config/cloudinary.js";
import Order from "../models/order.moel.js";

const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};


// POST /api/products/create - Create new product listing
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, listingType, price, condition, quantity, location } = req.body;

    // Validation
    if (!name || !description || !listingType) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and listing type are required",
      });
    }

    if (listingType === "sale" && (!price || price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price is required for sale listings",
      });
    }

    // Get user's ward_no
    const seller = req.user;

    // Handle multiple image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          uploadToCloudinary(file.buffer, "products")
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map(result => result.secure_url);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload images",
          error: uploadError.message,
        });
      }
    }

    // Create product
    const product = await Product.create({
      seller: req.user.id,
      name,
      description,
      category,
      listingType,
      price: listingType === "sale" ? price : 0,
      images: imageUrls,
      condition,
      quantity: quantity || 1,
      location: location || seller.address,
      ward_no: seller.ward_no,
      status: "available",
    });

    // Populate seller info
    const populatedProduct = await Product.findById(product._id)
      .populate("seller", "fullName email ward_no");

    res.status(201).json({
      success: true,
      message: "Product listed successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating product",
      error: error.message,
    });
  }
};

// GET /api/products - Get all products with filtering and pagination
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      listingType = "",
      minPrice = 0,
      maxPrice = "",
      ward = "",
      condition = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    let query = { status: "available" };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Listing type filter
    if (listingType) {
      query.listingType = listingType;
    }

    // Price range filter (only for sale items)
    if (listingType === "sale" || !listingType) {
      if (minPrice) {
        query.price = { ...query.price, $gte: Number(minPrice) };
      }
      if (maxPrice) {
        query.price = { ...query.price, $lte: Number(maxPrice) };
      }
    }

    // Ward filter
    if (ward && !isNaN(ward)) {
      query.ward_no = parseInt(ward);
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    // Get total count
    const totalProducts = await Product.countDocuments(query);

    // Get products with pagination
    const products = await Product.find(query)
      .populate("seller", "fullName email ward_no")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        limit: parseInt(limit),
        hasMore: parseInt(page) * parseInt(limit) < totalProducts,
      },
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching products",
      error: error.message,
    });
  }
};

// GET /api/products/:id - Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("seller", "fullName email ward_no phone");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching product",
      error: error.message,
    });
  }
};

// GET /api/products/my-listings - Get user's own product listings
export const getMyListings = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching your listings",
      error: error.message,
    });
  }
};

// PUT /api/products/:id - Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, condition, quantity, status } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined && product.listingType === "sale") product.price = price;
    if (condition) product.condition = condition;
    if (quantity !== undefined) product.quantity = quantity;
    if (status) product.status = status;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating product",
      error: error.message,
    });
  }
};

// DELETE /api/products/:id - Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting product",
      error: error.message,
    });
  }
};

// ============ CART CONTROLLERS ============

// POST /api/products/cart/add - Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || product.status !== "available") {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    // Cannot add own product to cart
    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot add your own product to cart",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate cart with product details
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName" },
      });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error adding to cart",
      error: error.message,
    });
  }
};

// GET /api/products/cart - Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email" },
      });

    if (!cart) {
      cart = { items: [] };
    }

    // Filter out unavailable products
    if (cart.items) {
      cart.items = cart.items.filter(
        item => item.product && item.product.status === "available"
      );
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching cart",
      error: error.message,
    });
  }
};

// PUT /api/products/cart/update - Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Product ID and valid quantity are required",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName" },
      });

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating cart",
      error: error.message,
    });
  }
};

// DELETE /api/products/cart/remove/:productId - Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName" },
      });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error removing from cart",
      error: error.message,
    });
  }
};

// DELETE /api/products/cart/clear - Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error clearing cart",
      error: error.message,
    });
  }
};

// ============ ORDER CONTROLLERS ============

// POST /api/products/orders/create - Create order from cart
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, contactNumber, notes } = req.body;

    if (!deliveryAddress || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Delivery address and contact number are required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product || item.product.status !== "available") {
        continue;
      }

      // Check quantity availability
      if (item.quantity > item.product.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${item.product.name}`,
        });
      }

      const itemPrice = item.product.listingType === "sale" ? item.product.price : 0;
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: itemPrice,
        seller: item.product.seller,
      });

      // Update product quantity
      item.product.quantity -= item.quantity;
      if (item.product.quantity === 0) {
        item.product.status = "sold";
      }
      await item.product.save();
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No available products in cart",
      });
    }

    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      contactNumber,
      notes,
      status: "pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "fullName email")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email phone" },
      });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating order",
      error: error.message,
    });
  }
};

// GET /api/products/orders/my-orders - Get user's purchase orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching orders",
      error: error.message,
    });
  }
};

// GET /api/products/orders/my-sales - Get user's sales (as seller)
export const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user.id })
      .populate("buyer", "fullName email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Filter to show only items sold by this user
    const mySalesOrders = orders.map(order => {
      const myItems = order.items.filter(
        item => item.seller.toString() === req.user.id
      );
      return {
        ...order.toObject(),
        items: myItems,
      };
    });

    res.status(200).json({
      success: true,
      count: mySalesOrders.length,
      orders: mySalesOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching sales",
      error: error.message,
    });
  }
};

// GET /api/products/orders/:id - Get single order details
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("buyer", "fullName email phone")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email phone" },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is buyer or seller
    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isSeller = order.items.some(
      item => item.seller._id.toString() === req.user.id
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching order",
      error: error.message,
    });
  }
};

// PUT /api/products/orders/:id/status - Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only buyer can update order status
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can update order status",
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("buyer", "fullName email")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName" },
      });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating order status",
      error: error.message,
    });
  }
};