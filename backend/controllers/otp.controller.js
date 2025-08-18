// src/controllers/otpController.js
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";
import randomstring from "randomstring";

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = randomstring.generate({ length: 6, charset: "numeric" });

    await Otp.create({ email, otp });

    await sendEmail({
      to: email,
      subject: "Your OTP for JobReferralClub",
      message: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });

    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Invalidate OTP after use
    await Otp.deleteOne({ _id: record._id });

    // (Optional) Update User model to mark as verified

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
