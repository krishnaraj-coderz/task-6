const express = require("express")
const route = express.Router();
const studentController = require("../controller/studentController")

route.post("/add",studentController.addStudent)
route.get("/show",studentController.getStudentDetails)
route.get("/update/:id",studentController.updateStudents)
route.get("/delete/:id",studentController.deleteStudentDetails)
route.get("/custom",studentController.customStudents)
route.get("/customagg",studentController.customStudentsAgg)

module.exports = route
