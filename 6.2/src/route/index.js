const route = require("express").Router();
const employeeController = require("../controller/employee");
const empRoute = require("./empRoute");
const salaryRoute = require("./salaryRoute");

route.post("/sign-up", employeeController.signUpEmployee);
route.post("/login", employeeController.loginEmployee);
route.use("/employee",empRoute);
route.use("/salary",salaryRoute);


module.exports  = route;