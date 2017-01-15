// ITS A GOOD IDEA TO JUST COPY THIS WHOLE DOC AND USE IT WITH OTHER APPS

var mongoose = require("mongoose");

var dbURI = 'mongodb://localhost/landscout';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function (){
    console.log('Mongoose connected to ' + dbURI)
})

mongoose.connection.on('error', function (err){
    console.log('Mongoose error ' + err);
})

mongoose.connection.on('disconnected', function (){
    console.log('Mongoose disconnected');
})


// THE FOLLOWING IS A FUNCTION TO CALL FOR SHUTDOWN
var gracefulShutdown = function (msg, callback){
    mongoose.connection.close(function (){
        console.log('Mongoose disconnected through ' +msg);
        callback();
    })
}

// THIS IS TO KILL THE NODEMON PROCESS
process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function (){
        process.kill(process.pid, 'SIGUSR2');
    });
})

// SIGINT AND SIGTERM ARE FOR WINDOWS AND HEROKU, RESPECTIVELY
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function (){
        process.exit(0);
    });
})

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function (){
        process.exit(0);
    });
})


require("./locations");