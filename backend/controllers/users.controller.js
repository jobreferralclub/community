import User from "../models/User.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, accountRole } = req.body;
    const newUser = new User({ name, email, password, accountRole });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, accountRole } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, accountRole },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all users
export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: `${result.deletedCount} users deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user role
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

// Update user role
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

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google login/signup
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
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to process Google login" });
  }
};
