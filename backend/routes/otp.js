import express from "express";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";
import randomstring from "randomstring";

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = randomstring.generate({ length: 6, charset: 'numeric' });
  await Otp.create({ email, otp });
  await sendEmail({
    to: email,
    subject: "Your OTP for JobReferralClub",
    message: `<p>Your OTP is: <b>${otp}</b></p>`
  });
  res.json({ message: "OTP sent to email" });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  await Otp.deleteOne({ _id: record._id }); // Invalidate OTP after use
  // Optionally, mark user as verified in User model here
  res.json({ message: "Email verified successfully!" });
});

export default router;
