const Joi = require("joi");

const usernameSchema = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required()
  .label("Username");

const emailSchema = Joi.string()
  .email({ minDomainSegments: 2 })
  .required()
  .label("Email");

const passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  .required()
  .label("Password")
  .messages({
    "string.pattern.base":
      "Password must be alphanumeric and between 3 and 30 characters",
  });

const createUserValidationSchema = Joi.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginValidationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const create = async (req, res, next) => {
  try {
    await createUserValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ msg: "user creation failed ", error: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    await loginValidationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ msg: "user login failed ", error: err.message });
  }
};

const refresh = async (req, res, next) => {
  try {
    await refreshSchema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ msg: "refreshing failed ", error: err.message });
  }
};

module.exports = {
  create,
  login,
  refresh,
};
