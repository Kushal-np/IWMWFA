import Truck from "../models/truck.model.js";
import Route from "../models/route.model.js";

export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find()
      .populate("route")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trucks.length,
      trucks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching trucks",
      error: error.message
    });
  }
};

export const getTrucksByRoute = async (req, res) => {
  try {
    const { ward } = req.params;

    if (!ward || isNaN(ward)) {
      return res.status(400).json({
        success: false,
        message: "Valid ward number is required"
      });
    }

    const route = await Route.findOne({ ward_no: parseInt(ward) });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: `No route found for ward ${ward}`
      });
    }

    const trucks = await Truck.find({ route: route._id })
      .populate("route");

    res.status(200).json({
      success: true,
      ward: parseInt(ward),
      route: {
        ward_no: route.ward_no,
        pickup_days: route.pickup_days,
        pickup_time: route.pickup_time
      },
      count: trucks.length,
      trucks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching trucks by route",
      error: error.message
    });
  }
};