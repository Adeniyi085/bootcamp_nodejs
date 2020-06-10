const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require('../utils/geocoder');
const Bootcamp = require("../models/Bootcamp");

//"description      -Get all Bootcamps"
//route         -Get /api/v1/bootcamps
//@access       Public access
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query; 
  //create req.query
  const reqQuery = { ...req.query}

  //Exclude Fields
  const removeFields = ["select", "sort", "page", "limit"]
  //loop over removeFields and delete from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  //create query string 
  let queryStr = JSON.stringify(reqQuery)

//create operators ($gt, $lt, $lte, $in, $gte) 
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);  
  //finding resource 
  query = Bootcamp.find(JSON.parse(queryStr))

  if(req.query.select){
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  //Sort
if(req.query.sort){
  const sortBy = req.query.sort.split(",").join(" ")
  query = query.sort(sortBy)
} else {
  query = query.sort('-createdAt')
}
//Pagination
const page = parseInt(req.query.page, 10) || 1
const limit = parseInt(req.query.limit, 10) || 10
const startIndex = (page - 1) * limit
const endIndex = page * limit 
const total = await Bootcamp.countDocuments()

query = query.skip(startIndex).limit(limit )
  //Executing the result 
  const bootcamps = await query
  //Pagination results
  const pagination = {}

  if(endIndex < total) {
    pagination.next= {
      page: page + 1,
      limit 
    }
  } 

  if(startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit 
    }
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

//"description      -Get single Bootcnew ErrorResponse(` `s"
//route         -Get /api/v1/bootcamps/:id
//@access       Public access
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the ID ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//"description      -create single Bootcamp"
//route         -Post /api/v1/bootcamps
//@access       private access

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
}); 
//"description      Update single Bootcamp"
//route         -Put /api/v1/bootcamps/:id
//@access       Private access

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the ID ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//"description      Delete single Bootcamp"
//route         -Put /api/v1/bootcamps/:id
//@access       Private access

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the ID ${req.params.id} not found`, 404)
    );
  }

  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

//"description      Get bootcamp within a certain radius"
//route         Get /api/v1/bootcamps/radius/:zipcode/:distance
//@access       Private access

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
 const { zipcode, distance } = req.params;

 //get latitude and logitude from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //calc radius using radiians
  //divide dist by radius of the earth
  //earth radius = 3,963 mi / 6,378 km
const radius = distance / 3963

const bootcamps = await Bootcamp.find({
  location: { $geoWithin: {$centerSphere: [[lng, lat], radius]}}
})
res.status(200).json({
  success: true,
  count: bootcamps.length,
  data: bootcamps
})
});
