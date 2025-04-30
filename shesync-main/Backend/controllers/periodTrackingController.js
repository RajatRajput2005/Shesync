import { PeriodTracking } from "../models/periodTrackingModel.js";
import { User } from "../models/userModel.js";

export const trackerDataController = async (req, res) => {
  const { userId, ...trackerData } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPeriodTracking = new PeriodTracking({
      user: user._id,
      ...trackerData,
    });

    await newPeriodTracking.save();
    console.log("Tracker data submitted:", newPeriodTracking);
    res
      .status(201)
      .json({ message: "Period tracking data saved successfully" });
  } catch (error) {
    console.error("Error saving period tracking data:", error);
    res.status(500).json({
      message: "Error saving period tracking data",
      error: error.message,
    });
  }
};

export const periodTrackingController = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const periodTrackingData = await PeriodTracking.findOne({
      user: userId,
    }).sort({ date: -1 });
    if (!periodTrackingData) {
      return res
        .status(404)
        .json({ message: "No period tracking data found for this user" });
    }
    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ periodTrackingData, user });
  } catch (error) {
    console.error("Error fetching period tracking data:", error);
    res.status(500).json({
      message: "Error fetching period tracking data",
      error: error.message,
    });
  }
};
export const waterUpdateController = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const today = new Date().toISOString().slice(0, 10);

    let tracking = await PeriodTracking.findOne({ user: userId });

    if (!tracking) {
      tracking = await PeriodTracking.create({
        user: userId,
        waterIntakeCount: 1,
        lastWaterLogDate: today,
      });
    } else {
      if (tracking.waterIntakeCount >= 8) {
        return res.status(400).json({
          message: "You have already logged 8 glasses of water today.",
        });
      }
      if (tracking.lastWaterLogDate !== today) {
        tracking.waterIntakeCount = 1;
        tracking.lastWaterLogDate = today;
      } else {
        tracking.waterIntakeCount += 1;
      }
      await tracking.save();
    }
    res.status(200).json({
      message: `Water intake updated successfully. Current count: ${tracking.waterIntakeCount}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating water intake data",
      error: error.message,
    });
  }
};
