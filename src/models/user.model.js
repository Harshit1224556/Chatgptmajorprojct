const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        }
    },
    password:{
        type:String
    }
},
{
    timestamps:true
}
)

const userModel = mongoose.model("user",userScheme)
module.exports = userModel