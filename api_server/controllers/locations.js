var mongoose = require("mongoose");
var Loc = mongoose.model('Location');
var moment = require("moment")

// Reusable functions for making distance caluclations
var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();



// USE THIS FUNCTION TO TEST THE CONTROLLERS AS YOU GO and to return all responses
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};



// CREATE/POST NEW LOCATION
module.exports.locationsCreate = function(req, res) {


  Loc.create({
    name: req.body.locationToAPI,
    address: req.body.addressToAPI,
    zipcode: req.body.zipcodeToAPI,
    activities: req.body.activitiesToAPI.split(","),
    coords: req.body.coords,
    openingDate: req.body.openingDate,
    closingDate: req.body.closingDate
    // availableSeason: [{
    //   openingDate: req.body.openingDate,
    //   closingDate: req.body.closingDate
    // }],
    // // This needs to be made into a loop for multiple stay locations
    // stayOptions: [{
    //   placeName: req.body.placeName,
    //   indoorOutdoor: req.body.indoorOutdoor,
    //   squareAcres: req.body.squareAcres,
    //   bedrooms: req.body.bedrooms,
    //   bathrooms: req.body.bathrooms,
    //   yearBuilt: req.body.yearBuilt,
    //   nightlyRate: req.body.nightlyRate,
    //   freshWaterAccess: req.body.freshWaterAccess,
    //   electricity: req.body.electricity,
    //   roadAccess: req.body.roadAccess,
    //   description: req.body.description,
    //   photos: req.body.photos
    // }]
  }, function(err, location){
    if(err) {
      sendJSONresponse(res, 400, err);
    } else {
      sendJSONresponse(res, 201, location);
      console.log(location + " should now be in the database.")
    }
  });
};





// GET locations close to point
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);


  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };


var whatDate = function(){
    var dateSearch = req.query.dateSearch
    var checkIN = req.query.chkin;
    var checkOUT = req.query.chkout;
      if(dateSearch === 'false'){
          return;
      } else {
          return {openingDate: {$lte: new Date(checkIN)}, closingDate: {$gte: new Date(checkOUT)}}
      }
}

// if(dateSearch === true){
//   console.log("THERE IS A DATE SEARCH")
//   whatDate = {openingDate: {$lte: new Date(checkIN)}, closingDate: {$gte: new Date(checkOUT)}}
// } 
// console.log(whatDate)


  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10,
    // The query line is for all additional queries in geoNear
    query: whatDate()
  };
console.log(geoOptions.query)
  if (!lng || !lat || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJSONresponse(res, 404, {
      "message": "lng, lat and maxDistance query parameters are all required"
    });
    return;
  }


  Loc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations = [];

    if (err){
      sendJSONresponse(res, 404, err);
    } else {
      results.forEach(function(doc) {

            locations.push({
              distance: theEarth.getDistanceFromRads(doc.dis),
              name: doc.obj.name,
              address: doc.obj.address,
              rating: doc.obj.rating,
              activities: doc.obj.activities,
              // availableSeason: doc.obj.availableSeason[0],
              _id: doc.obj._id
            });  
      });



            sendJSONresponse(res, 200, locations)
    }
  });
};



module.exports.locationsReadOne = function(req, res) {

  // Error trap 1: Check that locationid exists in request parameters
  if (req.params && req.params.locationid) {
    // locationid is the URL PARAMETER!  DON'T FORGET THIS
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location){
        // error trap 2: if Mongoose doesn't return location, send 404 and exit scope
        if (!location){
          sendJSONresponse(res, 404, {"message" : "Location ID (URL PARAMETER) not found."});
          return;
        } 
        // error trap 3: if Mongoose returned any other error, send it as 404 response and exit scope.
          else if (err) {
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 200, location);
      });
  } else {
    sendJSONresponse(res, 404, {"message" : "No locationID in request."});
  }
};
  





module.exports.locationsUpdateOne = function(req, res) {
  sendJSONresponse(res, 200, {"status" : "success"});
};

module.exports.locationsDeleteOne = function(req, res) {
  sendJSONresponse(res, 200, {"status" : "success"});
};




