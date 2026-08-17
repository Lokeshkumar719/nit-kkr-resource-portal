const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = "mongodb://lokesh618:Loki12345@ac-zzn9rzq-shard-00-00.83hff68.mongodb.net:27017,ac-zzn9rzq-shard-00-01.83hff68.mongodb.net:27017,ac-zzn9rzq-shard-00-02.83hff68.mongodb.net:27017/nit_kkr_academic_platform?ssl=true&replicaSet=atlas-122nxm-shard-0&authSource=admin&appName=codingAdda";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" },
  isVerified: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

async function createTestUser() {
  await mongoose.connect(uri);
  const email = "testuser@nitkkr.ac.in";
  
  await User.deleteOne({ email });
  
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  
  const user = new User({
    email,
    password: hashedPassword,
    role: "ADMIN",
    isVerified: true
  });
  
  await user.save();
  console.log("Test user created: " + email);
  await mongoose.disconnect();
}

createTestUser().catch(console.error);
