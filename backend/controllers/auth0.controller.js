

import User from "../models/User.js"; // adjust path as needed

export const auth0Login = async (req, res) => {
    try {
        const { user } = req.body;

        if (!user || !user.email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if user exists by email
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
            // User already exists → return their details
            return res.json({
                message: "Auth0 login successful - user exists",
                user: existingUser,
            });
        } else {
            const newUser = new User({
                name: user.name || "Unnamed User",
                email: user.email,
                avatar: user.picture || "", // if you store profile pictures
                accountRole: "member", // default role, adjust as needed
                password: Math.random().toString(36).slice(-8), // random password, user won't use it
            });

            const savedUser = await newUser.save();

            return res.status(201).json({
                message: "Auth0 login successful - new user created",
                user: savedUser,
            });
        }
    } catch (error) {
        console.error("Auth0 login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// export const createUser = async (req, res) => {
//   try {
//     const { name, email, password, accountRole, education } = req.body;

//     // Create new user with education array if provided
//     const newUser = new User({
//       name,
//       email,
//       password,
//       accountRole,
//       education: education || [] // fallback empty array
//     });

//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };