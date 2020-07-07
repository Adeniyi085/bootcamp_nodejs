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

//Protect routes
const { protect, authorize} = require('../middleware/auth')
//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

router
  .route("/:id")
  .put(protect,authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect,authorize('publisher', 'admin'), deleteBootcamp)
  .get(getBootcamp)
  .get(getBootcampsInRadius);

module.exports = router;
