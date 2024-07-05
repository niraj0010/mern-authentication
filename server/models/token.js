const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true  // Ensure unique token per user
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1h" } // Token expires in 1 hour
});

module.exports = mongoose.model("Token", tokenSchema);
