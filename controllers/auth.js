const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


//"description      Register User
//route         /api/v1/auth/register
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
    res.status(200).json({success: true})
})