import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // stored as YYYY-MM
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // prevent generating separate _id for each certificate
);

export default certificateSchema;
