import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  photo: {
    type: String
  },
  state: {
    type: String
  },
  district: {
    type: String
  },
  townName: {
    type: String
  },
  villageName: {
    type: String
  },
  bankName: {
    type: String
  },
  branchName: {
    type: String
  },
  bankAcc: {
    type: String
  },
  bankType: {
    type: String
  },
  aadhar: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  tempPasswordHash: {
    type: String
  },
  tempPasswordExpires: {
    type: Date
  },
  registrationData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);