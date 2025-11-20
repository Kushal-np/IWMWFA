import PickUpRequest from "../models/business.model.js";
import User from "../models/user.model.js";

export const requestPickup = async (req, res) => {
  try {
    const { pickupAddress, wasteType, estimatedQuantity, preferredDate, notes } = req.body;

    const business = await User.findById(req.user.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    if (!pickupAddress) {
      return res.status(400).json({
        success: false,
        message: "Pickup address is required"
      });
    }

    const pickupRequest = await PickUpRequest.create({
      owner: business._id,
      pickupAddress: pickupAddress || business.address,
      wasteType,
      estimatedQuantity,
      preferredDate,
      notes,
      status: "pending"
    });

    // populate owner info for response
    const populatedRequest = await PickUpRequest.findById(pickupRequest._id)
      .populate("owner", "fullName email");

    res.status(201).json({
      success: true,
      message: "Pickup request submitted successfully. Admin will assign a truck soon.",
      pickupRequest: populatedRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during pickup request",
      error: error.message
    });
  }
};
