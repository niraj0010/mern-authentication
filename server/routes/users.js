const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        // Validate user input
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({ message: "User with given email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new User instance
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword
        });

        // Save the user to the database
        await user.save();

        // Send success response
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
