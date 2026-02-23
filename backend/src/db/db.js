const mongoose = require('mongoose')
async function  connecttoDb(){
    try{

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Db")
    }
    catch(err){
        console.log(err)
    }

}

module.exports = connecttoDb