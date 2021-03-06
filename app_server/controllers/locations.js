// this is the request module from npm that you needed to call the API.
var request = require("request");
var geocoder = require('geocoder');
var moment = require("moment")
// Setting options to pull data from API
var apiOptions = {
    server: "http://localhost:3000/"
};
if (process.env.NODE_ENV === 'production'){
    console.log("Zach, you need to specify where the app is making API calls.");
    apiOptions.server = '';
}


// FUNCTION TO HANDLE API ERRORS

var _showError = function(req, res, status){
    var title, content;
    if (status === 404){
        title = "404, page not found"
        content = "Ooops.  Can't find nothin' on this page."
    } else {
        title = status + ", somethin' happened";
        content = "Somethin' happened and I don't know what it is."
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    })
}






// Variable to render homepage used in homelist function
var renderHomepage = function(req, res, responseBody) {
    // gets passed through
    if (!(responseBody instanceof Array)){
        res.send("No location objects found in database")
    }
    res.render('locations-list', {
        title: 'Available Locations on Landscout',
        locations: responseBody
    });
    // each location in locations....location is arbitrary for/each variable 
};

// This function was created because I needed to reuse the get request for listing locations by coordinates
// The first use case was for user inputting their zip code
// The second use case was to render the default locations at the start screen.
// The latter use case may only be acceptable for mobile versions.
var queryLoc = function(req, res, LATcoordinates, LNGcoordinates, checkIn, checkOut) {
    var requestOptions, path;
    path = 'api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: LNGcoordinates,
            lat: LATcoordinates,
            dateSearch: true,
            chkin: checkIn,
            chkout: checkOut,
            maxDistance: 30000000000000
        }
    };
            console.log("Serving API data from " + apiOptions.server + path)

    request(requestOptions, function(err, response, body){
        renderHomepage(req, res, body)
        
    });
}



module.exports.doSearch = function(req, res){
    // This function will retrieve the geocoords from zipcode from Google's API.
    var zip = req.body.zip;
    var checkIn = req.body.checkIn;
    var checkOut = req.body.checkOut;

    geocoder.geocode( zip , function(err, data){
        if (err){
            console.log(err)
        }
        else {
            // Dialing deep into geocode object from google otherwise you get empty objects
            var LNGcoordinates = data.results[0].geometry.location.lng;
            var LATcoordinates = data.results[0].geometry.location.lat;
            queryLoc(req, res, LATcoordinates, LNGcoordinates, checkIn, checkOut)
        }
    })
}





module.exports.homelist = function(req,res){
    
    var requestOptions, path;
    path = 'api/locations';
    requestOptions = {
        url : apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: -0.987,
            dateSearch: false,
            lat: 45.3432,
            maxDistance: 30000000000000
        }
    };
            console.log("Serving API data from " + apiOptions.server + path)

    request(requestOptions, function(err, response, body){
        renderHomepage(req, res, body)
        
    });

};




// New function i'm trying to create
var getLocationInfo = function(req, res, callback){
    var locationSelected = req.params.locationid;
    var path = "api/locations/" + locationSelected;
    var requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    }
    request(requestOptions, function(err, response, body){
        var data = body;
        callback(req, res, data);
    })
}



// ALWAYS USE SEPERATION OF CONCERNS - WHY WE RENDER DETAIL PAGE IN SEPERATE FXN
var renderThePage = function(req, res, responseBody, page){
    var data = responseBody;
    console.log(page)
    res.render(page, {
        location: data
    });
    console.log(data);
};



// Get single location info
module.exports.locationInfo = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData){
        var page = 'location-info';
        renderThePage(req, res, responseData, page);
    });
};



// ADD LOCATION FORM
module.exports.addLocation = function(req, res){
    res.render('new-location');
}



// NEW LOCATION SEND
module.exports.doAddLocation = function(req, res){
    var postdata = {
        locationToAPI: req.body.name,
        addressToAPI: req.body.address,
        zipcodeToAPI: req.body.zipcode,
        activitiesToAPI: req.body.activities,
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingDate: req.body.openingDate,
        closingDate: req.body.closingDate
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
    }


    var path = "api/locations";
    var requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    } 


    request(requestOptions, function(err, response, body){

    })
}



// Get edit form
module.exports.editLocation = function(req, res){
    getLocationInfo(req, res, function(req, res, responseData){
        var page = 'edit-form';
        renderThePage(req, res, responseData, page);
    });
};



// Put edit for location
module.exports.doEditLocation = function(req, res){
    
}


// Delete location


