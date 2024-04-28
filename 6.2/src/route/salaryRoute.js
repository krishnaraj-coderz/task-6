const route = require("express").Router();
const employeeController = require("../controller/employee")

route.post("/add", employeeController.addSalary)

module.exports = route