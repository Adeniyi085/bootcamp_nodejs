const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp, 
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");
const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

//include other resource router

const courseRouter = require('./courses')

const router = express.Router();

//Protect

const { protect } = require('../middleware/auth')
//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/:id/photo').put(protect, bootcampPhotoUpload)

router
  .route("/:id")
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)
  .get(getBootcamp)
  .get(getBootcampsInRadius);

module.exports = router;
