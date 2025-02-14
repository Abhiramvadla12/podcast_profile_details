const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();

const { dbConnect } = require("./db");

dbConnect();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define Profile Schema
const profileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  country: String,
  gender: String,
  about: String,
  file: { data: String, contentType: String }, // Store image as Base64 string
});

// Create Profile Model
const Profile = mongoose.model("profile_details", profileSchema);

// Configure Multer for File Uploads (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to Update Profile
app.post("/api/updateProfile", upload.single("file"), async (req, res) => {
  try {
    const { email, country, gender, about } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const fileData = req.file
      ? { data: req.file.buffer.toString("base64"), contentType: req.file.mimetype }
      : null;

    let updateData = { country, gender, about };
    if (fileData) updateData.file = fileData; // Only update image if a new file is uploaded

    const profile = await Profile.findOneAndUpdate(
      { email },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// Route to Fetch Profile
app.get("/api/getProfile/:username", async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username });

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
