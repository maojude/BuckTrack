const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected successfully");
    }catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose. 
// It exports a function that attempts to connect to the 
// database using the URI stored in an environment variable. 
// If the connection is successful, it logs a success message; 
// if it fails, it logs the error and exits the process with a failure status.