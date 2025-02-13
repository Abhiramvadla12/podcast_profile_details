const mongoose = require("mongoose");
const dbConnect = ()=>{
    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_DATABASE}`)
    .then(()=>{
        console.log("database connected !!!");
    })
    .catch((err)=>{
        console.log("error in connection ",err);
    })
}

module.exports = {dbConnect};