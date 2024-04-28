const jwtAutheticater = (req,res,next)=>{
    try{
        const mangementAccess = ["/change-password","/custom"]
        const jwt = require("jsonwebtoken");
        require("dotenv").config();
        const token = req.headers.authorization?req.headers.authorization.split(" ")[1]:""
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,data)=>{
            if(err){
                throw new Error("Not a Valid token",err)
            }
            req.body.userName = data;
            if(mangementAccess.includes(req.url)){
                empauthorizer(req,res,next)
            }
            else{
                next()
            }
        })
    }
    catch(error){
        res.status("401").json({
            status:"fail",
            error: error.message
        })
    }
}

const empauthorizer  = async(req,res,next)=>{
    try{
        const employeeService = require("../dbservice/empDbs");
        const employee = await employeeService.retreiveEmpBy("userName", req.body.userName);
        if(employee.role==="management"){
            next()
        }
        else{
            throw new Error("You don't have management access")
        }
    }
    catch(error){
        res.status(403).json({
            status:"fail",
            message:error.message
        })
    }
}



module.exports = jwtAutheticater;