 const jwt = require('jsonwebtoken');
 const asyncHandler =require ('./async');
 const ErrorResponse =require ('../utils/errorResponse');
 const User = require('../models/User');


 //Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;


    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token= req.headers.authorization.split(' ')[1]
    } 
    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }

    //make sure token exist
if (!token){
    return next(new ErrorResponse('Not authorized to access this route', 401))
}

try {
    //verify the token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);
    //Get the Id from the current logged in User
    req.user = User.findById(decoded.id)

    next()
} catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
}
});