const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
      return res
        .status(409)
        .send({ message: "User with given email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new User instance
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate and save verification token
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    // Construct verification URL
    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

    // Send verification email
    await sendEmail(user.email, "Verify Email", url);

    // Send success response
    res
      .status(201)
      .send({ message: "An Email sent to your account. Please Verify" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    // Update user's verified status
    await User.updateOne({ _id: user._id }, { verified: true });

    // Remove the token from database
    await Token.findByIdAndDelete(token._id);

    // Send success response
    res.status(200).send({ message: "Email verified Successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
