const Joi = require("joi");

const RegisterValidation = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().min(3).max(30).required().label("Email"),
  password: Joi.string().required().label("Password"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirm Password"),
});

const LoginValidation = Joi.object({
  email: Joi.string().max(30).required().label("Email"),
  password: Joi.string().required().label("Password"), //check password strength
});


module.exports = {
  RegisterValidation,
  LoginValidation,

};
