var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var instanceRouter = require("./routes/instance");
var networkRouter = require("./routes/network");
var securityGroupRouter = require("./routes/securitygroup");
var volumeRouter = require("./routes/volume");
var projectRouter = require("./routes/project");
const cors = require("cors");

require("./config/db");
require("dotenv");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/instance", instanceRouter);
app.use("/network", networkRouter);
app.use("/securitygroup", securityGroupRouter);
app.use("/volume", volumeRouter);
app.use("/project", projectRouter);

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
