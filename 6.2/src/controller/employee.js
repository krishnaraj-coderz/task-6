const bcrypt = require("bcrypt")
require("dotenv").config();
const employeeService = require("../dbservice/empDbs");
const salaryService = require("../dbservice/salaryDbs");

const signUpEmployee = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALTING_VALUE));
        const data = req.body;
        data.hashedPassword = hashedPassword
        const employee = await employeeService.addEmployee(data);
        if (employee instanceof Error) {
            throw employee
        }
        res.status(201).json({
            status: "success",
            count: employee.length,
            data: employee
        })
    }
    catch (error) {
        next(error)
    }
}

const loginEmployee = async (req, res, next) => {
    try {
        const validator = require("validator")
        let employee;
        if (validator.isEmail(req.body.userNameMail)) {
            employee = await employeeService.retreiveEmpBy("email", req.body.userNameMail)
        }
        else {
            employee = await employeeService.retreiveEmpBy("userName", req.body.userNameMail)
        }
        if (employee instanceof Error) {
            throw employee
        }
        if (employee) {
            const isValidPass = await bcrypt.compare(req.body.password, employee.hashedPassword);
            if (isValidPass) {
                const jwt = require("jsonwebtoken");
                const token = jwt.sign(employee.userName, process.env.JWT_SECRET_KEY);
                res.status(200).json({
                    status: "success",
                    message: "Successfully Loged In",
                    token: token,
                })
            }
            else {
                throw new Error("Invalid Password");
            }
        }
        else {
            throw new Error("No user found with the given email or userName")
        }
    }
    catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const oldPassword = req.body.oldPassword ? req.body.oldPassword : "";
        const employee = await employeeService.retreiveEmpBy("userName", req.body.userName);
        const password = req.body.newPassword ? req.body.newPassword : employee.password
        const isValidPassword = await bcrypt.compare(oldPassword, employee.hashedPassword);
        if (isValidPassword) {
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALTING_VALUE));
            const userName = req.body.userName;
            const employee = await employeeService.updateEmp({ userName },
                { hashedPassword, password }
            );
            if (employee instanceof Error) {
                throw employee
            }
            if (employee.acknowledged && employee.modifiedCount) {
                res.status(200).json({
                    status: "success",
                    count: employee.length,
                    message: employee
                })
            }
            else{
                throw new Error("error in updation")
            }
        }
        else {
            throw new Error("Not a valid password")
        }
    }
    catch (error) {
        next(error)
    }
}

const addSalary = async (req, res, next) => {
    try {
        const salary = await salaryService.createSalary(req.body)
        if (salary instanceof Error) {
            throw salary
        }
        res.json(salary)
    }
    catch (error) {
        next(error)
    }
}

const getSalary = async (req, res, next) => {
    try {
        const salary = await employeeService.getEmpSalary();
        if (salary instanceof Error) {
            throw salary
        }
        res.status(200).json({
            status: "success",
            count: salary.length,
            data: salary
        })
    }
    catch (error) {
        next(error)
    }
}

const customEmp = async (req, res, next) => {
    try {
        const conditions = {}
        conditions.limit = req.query.limit ? parseInt(req.query.limit) : 10;
        conditions.page = (req.query.page && parseInt(req.query.page) !== 0) ? parseInt(req.query.page) : 1;
        conditions.search = req.query.search ? req.query.search : "";
        const fieldNames = Object.keys(require("../model").employeeDetail.schema.paths);
        fieldNames.push("averageSalary")
        const salaryFields = Object.keys(require("../model").salaryDetail.schema.paths);
        const sortBy = req.query.sortBy ? fieldNames.includes(req.query.sortBy) ? req.query.sortBy : `salaries.${req.query.sortBy}` : "_id";
        const sortOrder = req.query.sortOrder ? req.query.sortOrder : 1;
        conditions.sort = {[sortBy]:sortOrder}
        // search
        conditions.search = fieldNames.map((field) => {
            return { [field]: { $regex: conditions.search, $options: "i" } }
        })
        //filters
        conditions.filters = {}
        for (filter in req.query) {
            let matchedOperator = ["gte", "gt", "lte", "lt", "eq", "ne"].find((operator) => filter.includes(operator))
            let condition;
            let filterTerm = parseInt(req.query[filter]) || req.query[filter] || ""
            if (matchedOperator) {
                matchedOperator = "$" + matchedOperator
                condition = { [matchedOperator]: filterTerm || 0 }
                filter = filter.split("_")[0]
            }
            else {
                condition = { $regex: new RegExp(`${filterTerm}`, 'i') }
            }
            if (fieldNames.includes(filter)) {
                conditions.filters[filter] = condition
            }
            else if (salaryFields.includes(filter)) {
                conditions.filters["salaries." + filter] = condition
            }
        }
        // calling dbs
        const student = await employeeService.retreiveSubset(conditions)
        if (student instanceof Error) {
            throw student
        }
        res.json({
            status: "success",
            page: conditions.page,
            count: student.length,
            data: student.length>0 ?student : null
        });
    }
    catch (error) {
        next(error)
    }
}
module.exports = { signUpEmployee, loginEmployee, changePassword, getSalary, addSalary, customEmp }