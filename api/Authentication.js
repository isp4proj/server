const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//schema
const { Admin } = require("../schema/Admin");

//validation
const { RegisterValidation, LoginValidation } = require("../util/validation");

function generateAccessToken(userId, profile, fullname) {
  // expires in 24h
  let user = {
    userId: userId,
    profile: profile,
    fullname: fullname,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  return jwt.sign(user, "AKIAURO2OFILH25ELFJR", {
    algorithm: "HS512",
    issuer: "Neuromed",
  });
}

exports.SuperadminLogin = async (req, res) => {
  try {
    const validated = await LoginValidation.validateAsync(req.body.data);

    //check user exists
    const user = await Admin.findOne({ email: validated.email });
    // console.log(user);

    if (!user) {
      return res.status(403).json({
        status: "403",
        message: "Email or password is invalid",
      });
    }

    //compare hash
    const verify = bcrypt.compareSync(validated.password, user.password);
    console.log(verify);

    if (!verify) {
      return res.status(403).json({
        status: "403",
        message: "Email or password is invalid",
      });
    }

    //create jwt token
    let token = generateAccessToken(user.userId, user.profile, user.fullname);
    console.log(token);

    // set cookies
    res.cookie("jwtToken", token, {
      maxAge: new Date(new Date().valueOf() + 1000 * 3600 * 24), // 1 day
      httpOnly: false, //set this to true in production
      path: "/",
      secure: false,
      sameSite: true,
    });

    return res.status(201).json({
      status: "201",
      message: "User authenticated successfully",
      data: token,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.SuperadminRegister = async (req, res) => {
  try {
    console.log(req.body.data);
    const validated = await RegisterValidation.validateAsync(req.body.data);
    console.log(validated);

    let user = await Admin.findOne({ email: validated.email });
    if (user) {
      return res.status(403).json({
        status: "403",
        message: "User already registered",
      });
    }

    //compare two passwords
    if (validated.password !== validated.confirmPassword) {
      return res.status(403).json({
        status: "403",
        message: "Password does not match",
      });
    }

    //generate hash
    const hash = bcrypt.hashSync(validated.password, 10);
    console.log(hash);

    //create user
    const data = new Admin({
      createdDate: Date.now(),
      userId: uuidv4(),
      fullname: validated.fullname,
      email: validated.email,
      profile: `https://joeschmoe.io/api/v1/${
        Math.floor(Math.random() * 90000) + 10000
      }`,
      password: hash,
    });

    const result = await data.save();
    console.log(result);

    return res.status(201).json({
      status: "201",
      message: "User created successfully, Please login",
      data: null,
    });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(500).json({
        status: "500",
        message: "Please provide your own details",
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "500",
        message: "Something went wrong, please try again later",
        data: null,
      });
    }
  }
};
