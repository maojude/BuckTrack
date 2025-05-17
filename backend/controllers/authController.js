const User = require("../models/User"); //load User model to interact with database
const jwt = require("jsonwebtoken");
const { auth } = require("firebase-admin");

//Generate JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10h" });
};

//Register a new user
exports.registerUser = async (req, res) => {
  const { fullName, email, password, provider = "local" } = req.body; //pulls the data from the JSON sent by frontend

  //Validation: Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    //Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    //Create the user
    const user = await User.create({
      fullName,
      email,
      password: provider === "local" ? password : undefined, // if local then set password, if not set to undefined as auth is handled by google
      provider,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; //pulls the data from the JSON sent by frontend

  //Validation: Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    //Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      //Check if user exists and password matches
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //check if user is using google login
    if (user.provider === "google") {
      return res
        .status(400)
        .json({ message: "This account uses Google Login" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password); //compare password using the method defined in User model
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Generate JWT token and send response

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // responds by sending status 200 which means OK then sends the user data
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user info", error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    const { uid, name, email } = decodedToken;

    // look for existing user
    let user = await User.findOne({ email });

    if (user && user.provider === "local") {
      return res.status(400).json({
        message: "This email is already registered with password login",
      });
    }

    // if new user
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        provider: "google",
      });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid Firebase token", error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, currency } = req.body;

    const updateFields = {};
    if (theme && ["light", "dark"].includes(theme)) {
      updateFields.theme = theme;
    }

    if (currency && ["PHP", "USD", "EUR", "JPY"].includes(currency)) {
      updateFields.currency = currency;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid preferences to update" });
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json({
      message: "Preferences updated",
      theme: user.theme,
      currency: user.currency,
    });
  } catch (err) {
    console.error("Error updating preferences:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("theme currency");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      theme: user.theme || "light",
      currency: user.currency || "PHP",
    });
  } catch (err) {
    console.error("Error getting preferences:", err);
    res.status(500).json({ message: "Server error" });
  }
};
