import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

function buildSafeUser(user: any) {
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  return safeUser;
}

function buildProfileUpdatePayload(body: Record<string, any>) {
  const {
    name,
    mobile,
    email,
    password,
    photo,
    state,
    district,
    townName,
    villageName,
    bankName,
    branchName,
    bankAcc,
    bankType,
    aadhar,
    ...rest
  } = body;

  return {
    directFields: { name, mobile, email, photo, state, district, townName, villageName, bankName, branchName, bankAcc, bankType, aadhar },
    registrationData: {
      state,
      district,
      townName,
      villageName,
      bankName,
      branchName,
      bankAcc,
      bankType,
      aadhar,
      ...rest
    },
    password
  };
}

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { password, confirmPassword, ...registrationData } = req.body;
    const { name, email, mobile } = registrationData;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "Name, mobile, and password are required" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      registrationData: {
        ...registrationData,
        aadharVerified: Boolean(registrationData.aadharVerified)
      }
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: buildSafeUser(newUser)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    res.status(500).json({ error: message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "No account found" });
    }
    
    // First try normal password
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    // If normal password didn't match, check temporary password (if still valid)
    if (!isMatch && user.tempPasswordHash && user.tempPasswordExpires) {
      const now = Date.now();
      const expiresAt = new Date(user.tempPasswordExpires).getTime();
      if (expiresAt > now) {
        const tempMatch = await bcrypt.compare(password, user.tempPasswordHash);
        if (tempMatch) {
          isMatch = true;
          // clear temp password after use
          user.tempPasswordHash = undefined as any;
          user.tempPasswordExpires = undefined as any;
          await user.save();
        }
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: buildSafeUser(user)
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(500).json({ error: message });
  }
});

// FORGOT PASSWORD - generate a temporary password valid for 3 minutes
router.post("/forgot-password", async (req, res) => {
  try {
    const { mobile } = req.body || {};
    if (!mobile) return res.status(400).json({ message: "Mobile number is required" });

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate a random 8 character alphanumeric temporary password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let tempPassword = '';
    for (let i = 0; i < 8; i++) tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));

    const hashed = await bcrypt.hash(tempPassword, 10);
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes

    user.tempPasswordHash = hashed as any;
    user.tempPasswordExpires = new Date(expiresAt) as any;
    await user.save();

    // NOTE: In production you should send this via SMS/Email. Returning in response for UI demo per requirements.
    res.json({ message: 'Temporary password generated', tempPassword, expiresAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate temporary password";
    res.status(500).json({ error: message });
  }
});

router.delete("/delete-account", async (req, res) => {
  try {
    const { mobile, password, confirmPassword } = req.body || {};

    if (!mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: "Mobile number, password, and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await User.findByIdAndDelete(user._id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete account";
    res.status(500).json({ error: message });
  }
});

router.patch("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { directFields, registrationData, password } = buildProfileUpdatePayload(req.body || {});

    const user = mongoose.Types.ObjectId.isValid(id)
      ? await User.findById(id)
      : await User.findOne({ mobile: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mergedRegistrationData = {
      ...(user.registrationData ? user.registrationData.toObject?.() || user.registrationData : {}),
      ...registrationData,
    };

    Object.entries(directFields).forEach(([key, value]) => {
      if (value !== undefined) {
        (user as any)[key] = value;
      }
    });

    user.registrationData = mergedRegistrationData;

    if (typeof password === "string" && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: buildSafeUser(user)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile update failed";
    res.status(500).json({ error: message });
  }
});

export default router;