const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/helpers");

async function create(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user)
      return res.status(400).json({ msg: "user already exists", data: null });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));

    const hashPassword = await bcrypt.hash(password, salt);

    const savedUser = await new User({
      username,
      email,
      password: hashPassword,
    }).save();

    return res.status(201).json({ data: savedUser });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword)
      return res
        .status(401)
        .json({ msg: "Invalid email or password", data: null });

    const accessToken = generateAccessToken({
      id: user._id,
      userName: user.username,
    });
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      data: {
        id: user._id,
        email,
        userName: user.username,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    const decoded = await verifyToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const accessToken = generateAccessToken(user._id);

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  create,
  login,
  refresh,
};
