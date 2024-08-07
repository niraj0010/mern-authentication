const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
