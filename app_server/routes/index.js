var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlLocations = require("../controllers/locations")

/* GET home page. */
router.get('/', ctrlLocations.homelist);
router.post('/', ctrlLocations.doSearch);
router.get('/location/new', ctrlLocations.addLocation);
router.post('/location/new', ctrlLocations.doAddLocation);
router.get('/location/:locationid', ctrlLocations.locationInfo);
// router.get('/location/:locationid/newSpot', ctrlLocations.addSpot);
// router.get('/location/:locationid/newSpot', ctrlLocations.doAddSpot);
// router.get('/location/:locationid/review/new', ctrlLocations.addReview)
// router.post('/location/:locaitonid/review/new', ctrlLocations.doAddReview)
// router.delete('/location/:locationid', ctrlLocations.deleteLocation);
router.get('/location/:locationid/edit', ctrlLocations.editLocation);
// router.put('/location/:locationid/', ctrlLocations.doEditLocation);

module.exports = router;