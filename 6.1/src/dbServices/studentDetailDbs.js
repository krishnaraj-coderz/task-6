const db = require("../model/")
const moongoseError = require("../utils/customError")
studentDetail = db.studentDetail;

const createStudentsDetails = async (data) => {
    try {
        const student = studentDetail.create(data).then((data) => {
            return data
        }).catch((error) => {
            if (error.name === "validation error") {
                throw new moongoseError()
            }
            else if (error.name === "MongoServerError" && error.code === 11000 ) {
                throw new moongoseError(`should be unique`);               
            }
            else {
                throw new moongoseError("Unknown Internal Server Error")
            }
        })
        return student
    }
    catch (error) {
        console.log(error)
        return error
    }
}

const retrieveStudents = async () => {
    try {
        const student = await studentDetail.find({});
        return student
    }
    catch (error) {
        return error
    }
}

const updateStudents = async (id, data) => {
    try {
        const student = await studentDetail.findByIdAndUpdate(id, data, {
            new: true
        })
        return student
    }
    catch (error) {
        return error
    }
}

const retreiveCustomStudents = async ({ start, limit, sort, filters }) => {
    try {
        console.log({ start, limit, sort, filters })
        const students = await studentDetail.find(filters).sort(sort)
        .skip(start)
        .limit(limit)
        return students
    } catch (error) {
        return error
    }
}

const retreiveAggStudents  = async ({ page, limit, sort, search, filters })=>{
    try{
        const student = await studentDetail.aggregate([
            {$match:{
                $or:search
            }},
            {$sort: sort},
            {$match: filters},
            {$skip:(page-1)*limit},
            {$limit: limit}           
        ])
        return student
    }
    catch(error){
        return error
    }
    //another approach to implement search
    // {$addFields:{
    //     "allField":{$objectToArray:"$$ROOT"}
    // }},
    // {$match:{"allField.v":{$regex:search ,$options:"i"}}},
} 

const deleteStudent = async (id) => {
    try {
        const student = await studentDetail.deleteMany({ id })
        return student
    }
    catch (error) {
        return error
    }
}

module.exports = {
    createStudentsDetails, retrieveStudents, deleteStudent, updateStudents,
    retreiveCustomStudents, retreiveAggStudents
}