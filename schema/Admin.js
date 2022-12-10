const mongoose = require("mongoose"); //admin user schema fields

const admin = new mongoose.Schema({
  createdDate: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const adminSchema = mongoose.model("Admin", admin);

module.exports = { Admin: adminSchema };
