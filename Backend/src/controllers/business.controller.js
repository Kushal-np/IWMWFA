import User from "../models/user.model";

// Request Pickup
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

        const pickupRequest = await PickupRequest.create({
            business_id: business._id,
            business_name: business.fullName,
            business_contact: business.email, 
            pickup_address: pickup_address || business.address,
            wasteType,
            estimatedQuantity,
            preferredDate,
            notes,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Pickup request submitted successfully. Admin will assign a truck soon.",
            pickupRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during pickup request",
            error: error.message
        });
    }
};