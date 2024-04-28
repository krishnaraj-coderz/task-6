const studentDbs = require("../../src/dbServices/studentDetailDbs")
const addStudent = async (req, res) => {
    try {
        const student = await studentDbs.createStudentsDetails(req.body);
        if (student instanceof Error) {
            throw student;
        }
        else {
            res.status(201).json({
                status: "success",
                count: student.length,
                data: student
            })
        }
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.msg
        })
    }
}

const getStudentDetails = async (req, res) => {
    try {
        const student = await studentDbs.retrieveStudents();
        console.log(student)
        res.status(200).json({
            status: "success",
            count: student.length,
            data: student
        })
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.msg
        })
    }
}

const updateStudents = async (req, res) => {
    try {
        const student = await studentDbs.updateStudents(req.params.id, req.body)
        res.json({
            status: "success",
            count: student.length,
            data: student
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.msg
        })
    }
}

const customStudents = async (req, res) => {
    const conditions = {}
    conditions.start = req.query.start ? parseInt(req.query.start) : 0;
    conditions.limit = req.query.limit ? parseInt(req.query.limit) : 10
    conditions.sort = req.query.sort ? req.query.sort.replace(",", " ") : "_id"
    const excludingTerms = ["sort", "search", "start", "limit"]
    excludingTerms.map((param) => {
        delete req.query[param]
    })
    conditions.filters = req.query;
    const student = await studentDbs.retreiveCustomStudents(conditions);
    res.json({
        status: "success",
        count: student.length,
        data: student
    });
}

const customStudentsAgg = async (req, res) => {
    // done using query can also be done using body
    try {
        const conditions = {}
        conditions.limit = req.query.limit ? parseInt(req.query.limit) : 10;
        conditions.page = (req.query.page && parseInt(req.query.page) !== 0) ? parseInt(req.query.page) : 1;
        conditions.sort = req.query.sortBy ? req.query.sortOrder ? { [req.query.sortBy]: parseInt(req.query.sortOrder) } : { [req.query.sortBy]: 1 } : { "_id": 1 }
        conditions.search = req.query.search ? req.query.search : "";
        const fieldNames = Object.keys(require("../model").studentDetail.schema.paths)
        conditions.search = fieldNames.map((field) => {
            return { [field]: { $regex: conditions.search, $options: "i" } }
        })
        console.log(req.query)
        conditions.filters = {}
        for (filter in req.query) {
            if (fieldNames.includes(filter)) {
                console.log(filter)
                conditions.filters[filter] = { $regex: new RegExp(`^${req.query[filter]}$`, 'i') }
            }
        }
        // another way to get filterTerms
        // conditions.filters = req.query.filters? req.query.filters : {};
        const student = await studentDbs.retreiveAggStudents(conditions)
        if (student.length > 0) {
            res.json({
                status: "success",
                page: conditions.page,
                count: student.length,
                data: student
            });
        }
        else {
            throw new Error("No data Found")
        }
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            page: 0,
            message: error.message
        })
    }
}

const deleteStudentDetails = async (req, res) => {
    const student = await studentDbs.deleteStudent(req.params.id);
    res.status(204).json({
        status: "success"
    })
}

module.exports = {
    addStudent, getStudentDetails, deleteStudentDetails, updateStudents,
    customStudents, customStudentsAgg
}