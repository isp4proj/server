const mongoose = require("mongoose");

const hostResult = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
  },
  scanId: {
    type: String,
    required: true,
  },
  cis: {
    type: Array,
    required: true,
  },
  info: {
    type: Object,
    required: true,
  },
});

const hostResultSchema = mongoose.model("HostResult", hostResult);

module.exports = { HostResult: hostResultSchema };
