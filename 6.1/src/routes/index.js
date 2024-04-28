const express = require("express");
const route = express.Router();

const studentRoute = require("./studentRoute")

route.use("/student",studentRoute)

module.exports = route