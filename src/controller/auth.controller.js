const userModel = require('../models/user.model')
const bycrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')
async function register(req,res){
    const {fullName:{firstname,lastname},email,password} = req.body
    const isuserexit = await userModel.findOne({email})
    if(isuserexit){
        res.status(400).json({message:"User Already Exists"})
    }
    const hashpassword = await bycrypt.hash(password,10)
    const user = await userModel.create({
        fullName:{firstname,lastname},
        email,
        password:hashpassword
    })
    const token = jwt.sign({id:user._id},process.env.JWTSECRET)
    res.cookie("token",token)
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
    res.cookie("token",token)
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