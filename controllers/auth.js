const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


//"description      Register User
//route         POST - /api/v1/auth/register
//@access        public
exports.register = asyncHandler(async(req, res, next) => {
    //Create User 
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    })
    //Create Token
    const token = user.getSignedJwtToken();

    res.status(200).json({success: true, token})
})

//Login User
//"description      Register User
//route        POST - /api/v1/auth/login
//@access        public
exports.login = asyncHandler(async(req, res, next) => {
    //Create User 
    const { email, password} = req.body;

    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400))
    }
    //check user
    const user = await User.findOne({email}).select('+password');

    //make sure user exist
    if(!user){
        return next(new ErrorResponse('invalid credentials', 401))
    }

    //check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch){
        return next(new ErrorResponse('invalid credentials', 401))
    }

    //Create Token
    const token = user.getSignedJwtToken();

    res.status(200).json({success: true, token})
})