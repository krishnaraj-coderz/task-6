const {connectDatabase} = require("./config/dbConfig")
const express = require("express");
const routes = require("./src/route")
const checkError = require("./src/error/errorHandler")
require("dotenv").config();
const app = express();

app.use(express.urlencoded({extended:true}),express.json())

connectDatabase()

app.use("/",routes)

app.all("*",(req,res,next)=>{
    err = new Error(message=`page ${req.originalUrl} not found`)
    err.name = "NotFoundError";
    err.status = 404;
    next(err)
})

app.use(checkError)

app.listen(process.env.PORT,()=>{
    console.log("listening to port "+process.env.PORT);
})

