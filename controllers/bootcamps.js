const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require('../utils/geocoder');
const Bootcamp = require("../models/Bootcamp");

//"description      -Get all Bootcamps"
//route         -Get /api/v1/bootcamps
//@access       Public access
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json(res.advancedResults);
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

//"description      Upload Photo to the Bootcamp
//route         -Put api/v1/bootcamps/:id/photo 
//@access       Private access

exports.bootcampPhotoUpload= asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with the ID ${req.params.id} not found`, 404)
    );
  }
  if(!req.files){
    return next(
      new ErrorResponse(`Please upload a file`, 400 )
    ); 
  }


  const file = req.files.file;

  //Want to make sure that the file is a photo 
if(!file.mimetype.startsWith('image')) {
  return next(new ErrorResponse('Please upload an Image file', 400))
  }

  //Check file Size
  if(file.size > process.env.MAX_FILE_UPLOAD){
    return  next(new ErrorResponse(`Please upload a Image file less than ${process.env.MAX_FILE_UPLOAD} `, 400))
  }

  // Create custom file name 
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err){
        console.error(err);
        return next(
          new ErrorResponse(`Problem with file upload`, 500 )
        ); 
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})

    res.status(200).json({
      success: true,
      data: file.name
    })
  })
  
})
