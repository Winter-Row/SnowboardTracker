var express = require('express');
const trips = require('../models/trips');
var router = express.Router();

//import models
const Trip = require("../models/trips");

//method to check if the user is logged in
function IsLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next(); //moves to the next middleware in the pipleline
  }
  else{
    res.redirect('/login'); //send a public user back to login
  }
}

//GET /trips
router.get('/', function(req, res, next) {
//   res.render('trips/index', { title: 'Trips' });
  Trip.find((err, trips)=>{
    if(err){
        console.log(err);
    }else{
        res.render('trips/index', { 
            title: "Trips", 
            dataset: trips,
            user: req.user
        });
    }
  })
});

//GET /trips/add
router.get('/add', IsLoggedIn, function(req, res, next) {
    res.render('trips/add', { title: 'Add a recent trip', user: req.user });
});

//POST /trips/add
router.post('/add', IsLoggedIn, (req,res,next) =>{
    Trip.create({
        resortName: req.body.resortName,
        date: req.body.date,
        timeSpent: req.body.timeSpent,
        spendings: req.body.spendings
    },
    (err, newTrip) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/trips');
        }
    });
});

//GET handler for /trips/delete
router.get('/delete/:_id',IsLoggedIn, (req,res,next)=>{
    Trip.remove({
        _id: req.params._id
    },(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/trips');
        }
    });
});

//GET handler for /trips/edit
router.get('/edit/:_id',IsLoggedIn, (req,res,next)=>{
    Trip.findById(req.params._id, (err, trip)=>{
        if(err){
            console.log(err);
        }else{
            res.render('trips/edit', {title: 'Edit a trip', trip: trip, user: req.user});
        }
    });
});

//POST handler for /trips/edit
router.post('/edit/:_id',IsLoggedIn, (req,res,next)=>{
    Trip.findOneAndUpdate(
        {
            _id: req.params._id
        },
        {
            resortName: req.body.resortName,
            date: req.body.date,
            timeSpent: req.body.timeSpent,
            spendings: req.body.spendings
        },
        (err, updatedTrip)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/trips');
            }
        }
    )
});


module.exports = router;