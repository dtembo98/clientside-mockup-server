const jwt = require('jsonwebtoken')

exports.getLogin = (req,res,next) =>
{
    res.status(200).json({
    status: "success",
    name:"david",
    accessToken:'ftGs25tFRHdhghyddggyhyhjyddgtghtgtfvj'
    })
}

exports.postLogin = (req,res,next) =>
{
   
    res.status(200).json({
    status: "success",
    name:"david",
    accessToken:'ftGs25tFRHdhghyddggyhyhjyddgtghtgtfvj'
    })
}