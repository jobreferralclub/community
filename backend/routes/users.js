import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, accountRole } = req.body;
        const newUser = new User({ name, email, password, accountRole });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, email, password, accountRole } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password, accountRole },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete all users
router.delete('/', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/users/:id/role http://localhost:5001/api/users
router.patch("/:id/role", async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// Login (basic example – should use hashed passwords in production)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google login/signup
router.post('/google', async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "Missing Google user data" });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: "", // or null
                accountRole: "member", // default role for Google signups
                provider: "google"
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to process Google login" });
    }
});

export default router;
