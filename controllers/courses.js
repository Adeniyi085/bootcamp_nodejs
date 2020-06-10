const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course"); 
const Bootcamp= require("../models/Bootcamp"); 

//"description      -Get Courses
//route         -Get /api/v1/Courses
//@rouute        Get single course by id /api/v1/bootcamps/:bootcampId/courses
//@access       Public access

exports.getCourses = asyncHandler( async (req, res, next) => {
    //first to check if the bootcamp exist,if not we return all courses
    let query;

    if(req.params.bootcampId) {
        query = Course.find({bootcamp : req.params.bootcampId})
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }
    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})
//description      -Get Course
//route         -Get /api/v1/Courses/:id
//@access       Public access
exports.getCourse = asyncHandler( async (req, res, next) => {
    
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select: "name description"
    })

    if(!course) {
        return next(new ErrorResponse(`No Course with the ID ${req.params.id} found `, 404))
    }
    res.status(200).json({
        success: true,
        data: course
    })
})
//description      -Add a course
//route         -POST /api/v1/bootcamps/:bootcampId/courses
//@access       Private
exports.addCourse = asyncHandler( async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp with the ID ${req.params.bootcampId} found `, 404))
    }

    const course = await Course.create(req.body)
    res.status(200).json({
        success: true,
        data: course
    })
})

//description      -Update Course
//route         -PUT /api/v1/courses/:id
//@access       Private
exports.updateCourse = asyncHandler( async (req, res, next) => {

 let course = await Course.findById(req.params.id)

    if(!course) {
        return next(new ErrorResponse(`No course with the ID ${req.params.id} found `, 404))
    }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        })
    res.status(200).json({
        success: true,
        data: course
    })
})

//description      -Update Course
//route         -PUT /api/v1/courses/:id
//@access       Private
exports.deleteCourse = asyncHandler( async (req, res, next) => {

    const course = await Course.findById(req.params.id)
   
       if(!course) {
           return next(new ErrorResponse(`No course with the ID ${req.params.id} found `, 404))
       }
   
     await course.remove();
       res.status(200).json({
           success: true,
           data:{}
       })
   })