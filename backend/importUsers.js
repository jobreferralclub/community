// importUsers.js
import mongoose from "mongoose";
import fs from "fs";

// 1️⃣ Replace with your real connection string:
const MONGO_URI = "mongodb://admin:Bluebeaks1!@168.231.66.154:27017/communityDB?directConnection=true&authSource=admin&appName=mongosh+2.5.8"; 

// 2️⃣ Define your schema (or import your existing one)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  migratedFrom: String, // optional, for tracking
});

const User = mongoose.model("User", userSchema);

async function importUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 3️⃣ Read and parse JSON file
    const data = JSON.parse(fs.readFileSync("./users.json", "utf8"));

    // 4️⃣ Upsert users one by one
    for (const user of data) {
      const filter = { email: user.email }; // unique key
      const update = {
        $setOnInsert: {
          name: user.name,
          email: user.email,
          password: user.password, // already hashed in Auth0 export
          migratedFrom: "auth0-export-2025-10-11",
        },
      };
      const result = await User.updateOne(filter, update, { upsert: true });
      console.log(`${user.email} -> ${result.upsertedId ? "inserted" : "already exists"}`);
    }

    console.log("✅ All users processed.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
}

importUsers();
