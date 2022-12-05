const express = require("express");
const cors = require("cors");
const connect = require("./util/connction");
const https = require("https");
const fs = require("fs");
const path = require("path");

var app = express();
connect();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://54.238.175.157:3000",
      "https://client-zeta-rose.vercel.app",
    ],
    credentials: true,
  })
);

const {
  PostHostResults,
  GetHostResults,
  GetHostResult,
  DeleteHostResult,
} = require("./api/Results");

const { SuperadminLogin, SuperadminRegister } = require("./api/Authentication");

//routes
app.post("/results", PostHostResults);
app.get("/results", GetHostResults);
app.get("/result", GetHostResult);
app.post("/login", SuperadminLogin);
app.post("/register", SuperadminRegister);
app.get("/delete", DeleteHostResult);

function checkAuth(roles) {
  return function (req, res, next) {
    try {
      // Gather the jwt access token from the request header
      // console.log(req.headers.authorization);

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        idToken = req.headers.authorization.split("Bearer ")[1];

        jwt.verify(
          idToken,
          "AKIAURO2OFILH25ELFJR",
          { algorithms: ["HS512"] },
          function (err, decoded) {
            if (
              err ||
              decoded.authenticated === false ||
              decoded.iat > new Date()
            ) {
              return res
                .status(403)
                .json({ status: "403", message: "Unauthorized", data: null });
            }
            next();
          }
        );
      } else {
        console.error("No token found");
        return res
          .status(403)
          .json({ status: "403", message: "Unauthorized", data: null });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "500",
        message: "Something went wrong, please try again later",
        data: null,
      });
    }
  };
}

// var server = app.listen(5000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log("Example app listening at http://%s:%s", host, port);
// });

const options = {
  key: fs.readFileSync(path.join(__dirname, "./cert/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./cert/cert.pem")),
};

const server = https.createServer(options, app).listen(5000, () => {
  console.log("server running at " + 5000);
});
