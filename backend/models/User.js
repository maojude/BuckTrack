const mongoose = require("mongoose"); //load mongoose to define schema
const bcrypt = require("bcryptjs"); //load bcryptjs to hash password

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // now optional
    provider: { type: String, enum: ["local", "google"], default: "local" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    currency: { type: String, default: "PHP" },
    totalBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
// This code defines a Mongoose schema for a User model in a Node.js application.
