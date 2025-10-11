import User from "../models/User.js";
import bcrypt from "bcrypt";

// -------------------- CREATE USER --------------------
export const createUser = async (req, res) => {
  try {
    const { name, email, password, accountRole, education } = req.body;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      accountRole,
      education: education || [],
    });

    // Initialize gamification fields
    newUser.totalPointsCount = 0;
    newUser.profileUpdatesCount = 0;
    newUser.resumeUpdatesCount = 0;

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- GET ALL USERS --------------------
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- GET USER BY ID --------------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- UPDATE USER --------------------
export const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      accountRole,
      avatar,
      job_title,
      company,
      location,
      bio,
      phone,
      education,
      work,
      projects,
      skills,
      certificates,
    } = req.body;

    const updatedData = {
      name,
      email,
      accountRole,
      avatar,
      job_title,
      company,
      location,
      bio,
      phone,
      ...(education && { education }),
      ...(work && { work }),
      ...(projects && { projects }),
      ...(skills && { skills }),
      ...(certificates && { certificates }),
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- DELETE USER --------------------
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- DELETE ALL USERS --------------------
export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: `${result.deletedCount} users deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- USER ROLE --------------------
export const getUserRole = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("accountRole");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ role: user.accountRole });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["member", "admin", "recruiter", "tpo"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    await User.findByIdAndUpdate(id, { accountRole: role });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- LOGIN --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- GOOGLE LOGIN --------------------
export const googleLogin = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name)
    return res.status(400).json({ error: "Missing Google user data" });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
        accountRole: "member",
        provider: "google",
        totalPointsCount: 0,
        profileUpdatesCount: 0,
        resumeUpdatesCount: 0,
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to process Google login" });
  }
};

// -------------------- GAMIFICATION SYNC --------------------
export const syncPoints = async (req, res) => {
  try {
    const users = await User.find();
    const updatedUsers = [];

    for (let user of users) {
      let totalPoints =
        (user.postsCount || 0) * 10 +
        (user.commentsCount || 0) * 5 +
        (user.likesCount || 0) * 5;

      let profileUpdatesCount = 0;
      let resumeUpdatesCount = 0;

      if (user.name && user.email && user.avatar && user.phone) {
        totalPoints += 15;
        profileUpdatesCount = 1;
      }

      if (
        (user.skills && user.skills.length > 0) ||
        (user.work && user.work.length > 0) ||
        (user.education && user.education.length > 0) ||
        (user.projects && user.projects.length > 0) ||
        (user.certificates && user.certificates.length > 0)
      ) {
        totalPoints += 15;
        resumeUpdatesCount = 1;
      }

      user.totalPointsCount = totalPoints;
      user.profileUpdatesCount = profileUpdatesCount;
      user.resumeUpdatesCount = resumeUpdatesCount;

      await user.save();

      updatedUsers.push({
        id: user._id,
        totalPoints,
        profileUpdatesCount,
        resumeUpdatesCount,
      });
    }

    res.json({
      message: "Points synced successfully for all users",
      usersUpdated: updatedUsers.length,
      data: updatedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to sync points" });
  }
};
