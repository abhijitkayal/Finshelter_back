const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://abhi:QNeOAKefU5vrYvDc@finshelter.9fgepw5.mongodb.net/?appName=FinShelter", {});
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1); // Exit process with failure
	}
};

module.exports = connectDB;
