const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async () => {
   mongoose.connect(process.env.MONGO_CONN_STR).then((conn)=>{
      console.log("Connection established successfuly")
   }).catch(err=>{
      console.log("error connecting to database"+err)
   })
}

module.exports = { connectDatabase }