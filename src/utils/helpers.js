const jwt = require("jsonwebtoken");

const generateAccessToken = (data) => {
  const payload = {
    userId: data.id,
    name: data.userName,
  };

  const options = {
    expiresIn: "8h",
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, options);
};

const generateRefreshToken = (userId) => {
  const payload = {
    userId,
  };

  const options = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, options);
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      }
    );
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
