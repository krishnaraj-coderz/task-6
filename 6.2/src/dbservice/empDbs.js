const db = require("../model");
const employeeModel = db.employeeDetail;

const addEmployee = async (data) => {
    try {
        let employee = await employeeModel.create(data)
        employee = await employeeModel.findById(employee._id).select("-_id -__v -password -hashedPassword");
        return employee
    }
    catch (error) {
        return error
    }
}

const retreiveEmpBy = async (field, value) => {
    try {
        const employee = await employeeModel.findOne({ [field]: value })
        return employee
    }
    catch (error) {
        return error
    }
}

const updateEmp = async (condition, data) => {
    try {
        const employee = await employeeModel.updateOne(condition, data, {
            new: true
        })
        return employee
    }
    catch (error) {
        return error
    }
}

const getEmpSalary = async () => {
    const employee = await employeeModel.aggregate([
        {
            $lookup: {
                from: "salarydetails",
                localField: "userName",
                foreignField: "employeeName",
                as: "salaries"
            }
        },
        {
            $project: {
                "_id": false,
                "password": false,
                "hashedPassword": false,
                "__v": false,
                "salaries._id": false,
                "salaries.employeeName": false,
                "salaries.__v": false
            }
        },
    ])
    return employee
}

const retreiveSubset = async ({ page, limit, sort, search, filters }) => {
    try {
        const student = await employeeModel.aggregate([
            {
                $lookup:{
                    from:"salarydetails",
                    localField:"userName",
                    foreignField:"employeeName",
                    as:"salaries"
                }
            },
            {
                $addFields: {
                  "averageSalary": {$avg:"$salaries.salaryAmount"}
                },
            },
            {
                $match: {
                    $or: search
                }
            },
            { $sort: sort },
            { $match: filters },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $project: {
                    "_id": false,
                    "password": false,
                    "hashedPassword": false,
                    "__v": false,
                    "salaries._id": false,
                    "salaries.employeeName": false,
                    "salaries.__v": false
                }
            }
        ])
        return student
    }
    catch (error) {
        return error
    }
}

module.exports = {
    addEmployee, retreiveEmpBy, updateEmp, getEmpSalary, retreiveSubset
}


