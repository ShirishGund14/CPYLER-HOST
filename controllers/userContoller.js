const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const codeModel = require("../models/codeModel");
const mongoose = require('mongoose');



// Register user
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validation
    if (!username || !email || !password) {
      return res.send({
        success: false,
        message: "Please fill in all fields",
      });
    }
    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new userModel({
       username, 
      email, 
      password: hashedPassword,
      
    });
    await user.save();
    return res.send({
      success: true,
      message: "New User Created",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register callback",
      success: false,
      error,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All users data",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get All Users",
      error,
    });
  }
};

// Login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.send({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    return res.status(200).send({
      success: true,
      message: "Login successful",
      user,
      token, // Send the token to the client
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login Callback",
      error,
    });
  }
};



exports.userDashboardController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user=await userModel.findById(userId);
    console.log('userid',userId)

    const codeCounts = await codeModel.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$language", count: { $sum: 1 } } },
    ]);

    // Format the data for PieChart
    const pieChartData = codeCounts.map((entry, index) => ({
      id: index,
      value: entry.count,
      label: entry._id,
    }));

    // Send a clean JSON response without circular references
    res.status(200).json({
      success: true,
      message: "User dashboard data",
      pieChartData,
      user
    });
  } catch (error) {
    console.error(error);

    // Handle errors properly
    res.status(500).json({
      success: false,
      message: "Error in User Dashboard Controller",
      error: error.message, // Send only the error message to avoid circular references
    });
  }
};

// get current user
exports.userInfoController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user=await userModel.findById(userId);
    console.log('userid',userId)

    // Send a clean JSON response without circular references
    res.status(200).json({
      success: true,
      message: "User  data",
      user
    });
  } catch (error) {
    console.error(error);

    // Handle errors properly
    res.status(500).json({
      success: false,
      message: "Error in User info Controller",
      error: error.message, // Send only the error message to avoid circular references
    });
  }
};


// ... Other controller functions ...
