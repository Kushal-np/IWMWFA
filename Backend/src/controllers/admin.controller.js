// admin.controller.js
import User from "../models/user.model.js";
import Complaint from "../models/complaint.model.js";
import Truck from "../models/truck.model.js";
import Route from "../models/route.model.js";
import PickUpRequest from "../models/business.model.js";

// GET /api/admin/dashboard-data - Get comprehensive dashboard statistics
export const getDashboardData = async (req, res) => {
  try {
    // User Statistics
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBusinesses = await User.countDocuments({ role: "business" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Complaint Statistics
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
    const verifiedComplaints = await Complaint.countDocuments({ status: "verified" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });

    // Truck & Route Statistics
    const totalTrucks = await Truck.countDocuments();
    const totalRoutes = await Route.countDocuments();

    // Pickup Request Statistics
    const totalPickupRequests = await PickUpRequest.countDocuments();
    const pendingPickupRequests = await PickUpRequest.countDocuments({ status: "pending" });

    // Recent Complaints (last 5)
    const recentComplaints = await Complaint.find()
      .populate("user", "fullName email ward_no")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("description status location createdAt");

    // Recent Users (last 5)
    const recentUsers = await User.find({ role: { $in: ["user", "business"] } })
      .select("fullName email role ward_no createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Pickup Requests (last 5)
    const recentPickupRequests = await PickUpRequest.find()
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("pickupAddress wasteType estimatedQuantity preferredDate status createdAt");

    // Complaints by Status (for pie/bar charts)
    const complaintsByStatus = [
      { status: "Pending", count: pendingComplaints, color: "#FFA500" },
      { status: "Verified", count: verifiedComplaints, color: "#4169E1" },
      { status: "Resolved", count: resolvedComplaints, color: "#32CD32" }
    ];

    // Users by Role (for charts)
    const usersByRole = [
      { role: "Users", count: totalUsers, color: "#4169E1" },
      { role: "Businesses", count: totalBusinesses, color: "#FF6347" },
      { role: "Admins", count: totalAdmins, color: "#32CD32" }
    ];

    // Ward-wise Statistics (users per ward)
    const wardStats = await User.aggregate([
      { 
        $match: { 
          ward_no: { $exists: true, $ne: null },
          role: { $in: ["user", "business"] }
        } 
      },
      { 
        $group: { 
          _id: "$ward_no", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    const wardWiseUsers = wardStats.map(item => ({
      ward: `Ward ${item._id}`,
      count: item.count
    }));

    // Route Coverage (wards with routes)
    const routeCoverage = await Route.aggregate([
      {
        $group: {
          _id: "$ward_no",
          pickupDays: { $first: "$pickup_days" },
          pickupTime: { $first: "$pickup_time" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const wardCoverage = routeCoverage.map(item => ({
      ward: item._id,
      hasRoute: true,
      pickupDays: item.pickupDays,
      pickupTime: item.pickupTime
    }));

    // Response
    res.status(200).json({
      success: true,
      data: {
        statistics: {
          users: {
            total: totalUsers + totalBusinesses + totalAdmins,
            regular: totalUsers,
            businesses: totalBusinesses,
            admins: totalAdmins
          },
          complaints: {
            total: totalComplaints,
            pending: pendingComplaints,
            verified: verifiedComplaints,
            resolved: resolvedComplaints
          },
          operations: {
            totalTrucks,
            totalRoutes,
            wardsCovered: routeCoverage.length,
            totalPickupRequests,
            pendingPickupRequests
          }
        },
        charts: {
          complaintsByStatus,
          usersByRole,
          wardWiseUsers,
          wardCoverage
        },
        recentActivity: {
          recentComplaints,
          recentUsers,
          recentPickupRequests
        }
      }
    });

  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard data",
      error: error.message
    });
  }
};

// POST /api/admin/add-truck - Add new waste collection truck
export const addTruck = async (req, res) => {
  try {
    const { driver_name, driver_contact, ward_no } = req.body;

    // Validation
    if (!driver_name || !driver_contact) {
      return res.status(400).json({
        success: false,
        message: "Driver name and contact are required"
      });
    }

    // Validate driver contact (Nepali phone number)
    const phoneRegex = /^(97|98)\d{8}$/;
    if (!phoneRegex.test(driver_contact)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be a valid Nepali number (10 digits starting with 97 or 98)"
      });
    }

    // Find route by ward_no if provided
    let routeId = null;
    if (ward_no) {
      const route = await Route.findOne({ ward_no: parseInt(ward_no) });
      if (!route) {
        return res.status(404).json({
          success: false,
          message: `No route found for ward ${ward_no}. Please create a route first.`
        });
      }
      routeId = route._id;
    }

    // Check if driver already exists
    const existingTruck = await Truck.findOne({ driver_contact });
    if (existingTruck) {
      return res.status(400).json({
        success: false,
        message: "A truck with this driver contact already exists"
      });
    }

    // Create truck
    const truck = await Truck.create({
      driver_name,
      driver_contact,
      route: routeId
    });

    // Populate route details
    const populatedTruck = await Truck.findById(truck._id).populate("route");

    res.status(201).json({
      success: true,
      message: "Truck added successfully",
      truck: populatedTruck
    });

  } catch (error) {
    console.error("Add truck error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding truck",
      error: error.message
    });
  }
};

// POST /api/admin/add-route - Add new collection route
export const addRoute = async (req, res) => {
  try {
    const { ward_no, pickup_days, pickup_time } = req.body;

    // Validation
    if (!ward_no || !pickup_days || !Array.isArray(pickup_days) || pickup_days.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ward number and at least one pickup day are required"
      });
    }

    // Validate ward number
    if (isNaN(ward_no) || ward_no < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid ward number"
      });
    }

    // Validate pickup days
    const validDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const invalidDays = pickup_days.filter(day => !validDays.includes(day));
    
    if (invalidDays.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid pickup days: ${invalidDays.join(", ")}. Must be one of: ${validDays.join(", ")}`
      });
    }

    // Check if route already exists for this ward
    const existingRoute = await Route.findOne({ ward_no: parseInt(ward_no) });
    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: `Route for ward ${ward_no} already exists`
      });
    }

    // Validate pickup time format (optional but recommended)
    if (pickup_time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(pickup_time)) {
        return res.status(400).json({
          success: false,
          message: "Invalid time format. Use HH:MM format (e.g., 09:00, 14:30)"
        });
      }
    }

    // Create route
    const route = await Route.create({
      ward_no: parseInt(ward_no),
      pickup_days,
      pickup_time: pickup_time || "08:00" // Default morning pickup
    });

    res.status(201).json({
      success: true,
      message: `Route for ward ${ward_no} added successfully`,
      route
    });

  } catch (error) {
    console.error("Add route error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding route",
      error: error.message
    });
  }
};

// GET /api/admin/all-users - Get all users with filtering and pagination
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      role = "", 
      ward = "" 
    } = req.query;

    // Build search query
    let searchQuery = {};

    // Role filter
    if (role && ["user", "business", "admin"].includes(role)) {
      searchQuery.role = role;
    } else {
      // Exclude admins by default unless specifically searching for them
      searchQuery.role = { $in: ["user", "business"] };
    }

    // Ward filter
    if (ward && !isNaN(ward)) {
      searchQuery.ward_no = parseInt(ward);
    }

    // Search filter (name or email)
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get paginated users
    const users = await User.find(searchQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get summary statistics
    const userCount = await User.countDocuments({ ...searchQuery, role: "user" });
    const businessCount = await User.countDocuments({ ...searchQuery, role: "business" });

    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      summary: {
        users: userCount,
        businesses: businessCount
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        limit: parseInt(limit),
        hasMore: parseInt(page) * parseInt(limit) < totalUsers
      },
      users
    });

  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
      error: error.message
    });
  }
};