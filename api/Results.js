const moment = require("moment");
const { HostResult } = require("../schema/HostResult");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

exports.PostHostResults = async (req, res) => {
  try {
    let data = req.body;

    const newResult = new HostResult({
      createdAt: moment(new Date()).format("YYYY-MM-DD, h:mm:ss a"),
      scanId: uuidv4(),
      cis: data.cis,
      info: data.info,
    });
    const result = await newResult.save();
    return res.send(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetHostResults = async (req, res) => {
  try {
    const result = await HostResult.find({});
    return res.send(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "500",
      message: "Something went wrong, please try again later",
      data: null,
    });
  }
};

exports.GetHostResult = async (req, res) => {
  try {
    let id = req.query.id;

    const result = await HostResult.findOne({ scanId: id });

    let arr1 = result.cis[0].results;
    let arr2 = result.cis[1].results;
    let arr3 = result.cis[2].results;

    let cis = [];

    mainArr = [...arr1, ...arr2, ...arr3];

    cis.push(mainArr);

    let info = _.filter(cis[0], function (o) {
      return o.result === "INFO";
    });

    let pass = _.filter(cis[0], function (o) {
      return o.result === "PASS";
    });

    let warn = _.filter(cis[0], function (o) {
      return o.result === "WARN";
    });

    let p = pass.length + info.length;
    let bench = (p / 62) * 100;

    return res.send({
      pass,
      warn,
      info,
      information: result.info,
      scanId: result.scanId,
      bench,
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

exports.DeleteHostResult = async (req, res) => {
  try {
    let id = req.query.id;

    await HostResult.findOneAndDelete({ scanId: id });
    return res.status(200).json({
      status: "200",
      message: "Delete successfully",
      data: null,
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
