const {connectDatabase} = require("./config/dbConfig")
const express = require("express");
const routes = require("./src/routes")
const globalErrorHandler = require("./src/middlerware/errorHandlingWare")
const customError = require("./src/utils/customError")
require("dotenv").config();
const app = express();

app.use(express.urlencoded({extended:true}),express.json())

connectDatabase()

app.use("/",routes)

app.all("*",(req,res,next)=>{
    err = new customError(404,`page ${req.originalUrl} not found`)
    next(err)
})

app.use(globalErrorHandler)

app.listen(process.env.PORT,()=>{
    console.log("listening to port");
})

