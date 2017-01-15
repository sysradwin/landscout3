// this is the request module from npm that you needed to call the API.
var request = require("request");

// Setting options to pull data from API
var apiOptions = {
    server: "https://landscout3-sysradmin.c9users.io/"
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
    if (!(responseBody instanceof Array)){
        res.send("No location objects found in database")
    }
    res.render('locations-list', {
        title: 'Landscout - GO POUND SAND',
        locations: responseBody
    });
    // each location in locations....location is arbitrary for/each variable 
    console.log(responseBody)
};

module.exports.homelist = function(req,res){
    // var requestOptions, path;
    // path = 'api/locations';
    // requestOptions = {
    //     url : apiOptions.server + path,
    //     method: "GET",
    //     json: {},
    //     qs: {
    //         lng: -0.9992599,
    //         lat: 54.37895,
    //         maxDistance: 30000000900
    //     }
    // };
    //         console.log("Serving API data from " + apiOptions.server + path)

    // request(requestOptions, function(err, response, body){
    //     renderHomepage(req, res, body)
        
    //     console.log(requestOptions);
    // });
    
    res.render("locations-list")

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
        name: req.body.name,
        address: req.body.address,
        activities: req.body.activities.split(","),
        lng: req.body.lng, 
        lat: req.body.lat,
        availableSeason: [{
          openingDate: req.body.openingDate,
          closingDate: req.body.closingDate
        }],
        // This needs to be made into a loop for multiple stay locations
        stayOptions: [{
          placeName: req.body.placeName,
          indoorOutdoor: req.body.indoorOutdoor,
          squareAcres: req.body.squareAcres,
          bedrooms: req.body.bedrooms,
          bathrooms: req.body.bathrooms,
          yearBuilt: req.body.yearBuilt,
          nightlyRate: req.body.nightlyRate,
          freshWaterAccess: req.body.freshWaterAccess,
          electricity: req.body.electricity,
          roadAccess: req.body.roadAccess,
          description: req.body.description,
          photos: req.body.photos
        }]
    }
    var path = "api/locations/";
    var requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    } 
    
    request(requestOptions, function(err, response, body){
        if(response.statusCode === 201){
            res.send("REQUEST WORKED")
        } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError'){
            res.redirect('/location/new?err=val')
        } else {
                    _showError(req, res, response.statusCode)

        }
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


