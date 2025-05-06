const User = require('../models/User');
const Income = require('../models/Income'); //load Income model to interact with database   

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const{ icon, source, amount, date } = req.body; 

        // Validation: Check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        
        await newIncome.save(); // Save the new income to the database
        res.status(200).json(newIncome);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

// Get ALL Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
        res.json(income); // Return the income data as JSON
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id); // Find and delete the income by ID and userId
        res.json({ message: "Income deleted successfully" }); // Respond with success message
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

