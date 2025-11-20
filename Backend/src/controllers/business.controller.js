import User from "../models/user.model";

// Request Pickup
const requestPickup = async (req, res) => {
    try {
        const { pickup_address, waste_type, estimated_quantity, preferred_date, notes } = req.body;
        
        // Get business user details
        const business = await User.findById(req.user.id);
        
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // Validation
        if (!pickup_address) {
            return res.status(400).json({
                success: false,
                message: "Pickup address is required"
            });
        }

        // Create pickup request
        const pickupRequest = await PickupRequest.create({
            business_id: business._id,
            business_name: business.full_name,
            business_contact: business.email, // or phone if available
            pickup_address: pickup_address || business.address,
            ward_no: business.ward_no,
            waste_type,
            estimated_quantity,
            preferred_date,
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