const {salaryDetail} = require("../model")

const createSalary = async (data)=>{
    try{
        const salary  = await salaryDetail.create(data);
        return salary
    }
    catch(error){
        return error
    }
}

module.exports = {createSalary}