const connectDatabase = async ()=>{
    require("dotenv").config();
    const mongoose = require("mongoose");
    mongoose.connect(process.env.CONN_STR).then((conn)=>{
        console.log("connection established successfully");
    }).catch((err)=>{
        console.log("problem is establishing connection");
    })
}

module.exports = {connectDatabase}