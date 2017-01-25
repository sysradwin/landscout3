var mongoose = require("mongoose");


var reviewSchema = new mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var availableSeasonSchema = new mongoose.Schema({
    openingDate: String,
    closingDate: String,

});

var stayOptionsSchema = new mongoose.Schema({
        placeName: {
            type: String,
            // required: true
        },
        indoorOutdoor: {
            type: String,
            // required: true
        },
        squareAcres: Number,
        bedrooms: Number,
        bathrooms: Number,
        yearBuilt: Number,
        nightlyRate: {
            type: Number,
            // required: true
        },
        freshWaterAccess: {
            type: Boolean,
            // required: true
        },
        electricity: Boolean,
        roadAccess: {
            type: Boolean,
            // required: true
        },
        description: {
            type: String,
            // required: true
        },
        photos: Buffer,
        
});

var locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    // rating: {
    //     type: Number,
    //     "default": 0,
    //     min: 0,
    //     max: 5
    // },
    zipcode: String,
    activities: [String],
    // Always store coordinates longitude, latitude order.
    coords: {
        type: [Number],
        index: '2dsphere',
    },
    availableSeason: [availableSeasonSchema],
    // stayOptions: [stayOptionsSchema],
    // reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);


// DATA SEED WHITEBOARD
// FOR SEEDING THE DATABASE

// db.locations.save({
//     name: "Blue Park",
//     address: "1204 Salmon Way, AK",
//     rating: 4 ,
//     activities: ["Hunting", "Fishing", "Camping"],
//     coords: [-0.969, 51.455]
// })







//     stayOptions: [
//                     {   name: "Cabin"
//                         indoorOutdoor: "Indoor",
//                         squareAcres: 1,
//                         bedrooms: 4,
//                         bathrooms: 2,
//                         yearBuilt: 1985,
//                         nightlyRate: 500,
//                         description: "It's a great cabin in the woods.",
//                     },
                        
//                     {   name: "Field"
//                         indoorOutdoor: "Outdoor",
//                         squareAcres: 4,
//                         nightlyRate: 500,
//                         description: "A field in the middle of nowhere",
//                 }],
// })


