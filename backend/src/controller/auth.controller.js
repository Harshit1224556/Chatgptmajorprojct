const userModel = require('../models/user.model')
const bycrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: true,        // Always true for Render
        sameSite: 'none',    // Required for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

async function register(req,res){
    const fullName = req.body?.fullName || {}
    const firstname = fullName.firstname || fullName.firstName
    const lastname = fullName.lastname || fullName.lastName
    const { email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "firstname, lastname, email and password are required" })
    }

    const isuserexit = await userModel.findOne({email})
    if(isuserexit){
        return res.status(400).json({message:"User Already Exists"})
    }

    const hashpassword = await bycrypt.hash(password,10)
    const user = await userModel.create({
        fullName:{firstname,lastname},
        email,
        password:hashpassword
    })
    const token = jwt.sign({id:user._id},process.env.JWTSECRET)
    res.cookie("token",token,getCookieOptions())
    res.status(201).json({
        message:"User registered successfully",
        user:{
            email:user.email,
            _id:user._id,
            fullName:user.fullName
        }
    })
}
async function login(req,res){
    const {email,password} = req.body

    const isvaliduser = await userModel.findOne({email})
    if(!isvaliduser){
        return res.status(401).json({message:"Invalid email id"})
    }
    const ispassword = await bycrypt.compare(password,isvaliduser.password)
    if(!ispassword){
        return res.status(401).json({message:"Invalid email or password"})
    }
    const token = jwt.sign({id:isvaliduser._id},process.env.JWTSECRET)
    res.cookie("token",token,getCookieOptions())
    res.status(200).json({
        message:"user login successfully",
        user:{
            email:isvaliduser.email,
            _id:isvaliduser._id,
            fullName:isvaliduser.fullName
        }
    })
}
module.exports = {register,login}
