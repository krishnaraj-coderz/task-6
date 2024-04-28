const route = require("express").Router();
const employeeController = require("../controller/employee")
const jwtAutheticater = require("../middleware/jwtAuth")

route.post("/change-password",jwtAutheticater, employeeController.changePassword)
route.get("/salary",jwtAutheticater, employeeController.getSalary)
route.get("/custom",jwtAutheticater, employeeController.customEmp)

module.exports = route