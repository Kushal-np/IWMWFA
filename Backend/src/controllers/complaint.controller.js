import User from "../models/user.model.js";
import Complaint from "../models/complaint.model.js";
import cloudinary from "../config/cloudinary.js";
// Helper function to upload to Cloudinary
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

export const createComplaint = async (req, res) => {
  try {
    const { title , description, location } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let imageUrl = null;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "complaints");
        imageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: uploadError.message,
        });
      }
    }

    // Create complaint in DB
    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      location,
      image: imageUrl,
      status: "pending",
    });

    // Populate user info for response
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate("user", "fullName email");

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: populatedComplaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating complaint",
      error: error.message,
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching your complaints",
      error: error.message
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching complaints",
      error: error.message
    });
  }
};

// PUT /api/complaints/status/:id - Update complaint status (admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "verified", "resolved"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, verified, resolved"
      });
    }

    // Find and update complaint
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    complaint.status = status;
    await complaint.save();

    // Populate user info for response
    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("user", "fullName email");

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint: updatedComplaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating complaint status",
      error: error.message
    });
  }
};