var express = require('express');
const trips = require('../models/trips');
var router = express.Router();

//import models
const Trip = require("../models/trips");

//GET /trips
router.get('/', function(req, res, next) {
//   res.render('trips/index', { title: 'Trips' });
  Trip.find((err, trips)=>{
    if(err){
        console.log(err);
    }else{
        res.render('trips/index', { 
            title: "Trips", 
            dataset: trips
        });
    }
  })
});

//GET /trips/add
router.get('/add', function(req, res, next) {
    res.render('trips/add', { title: 'Add a recent trip' });
});

//POST /trips/add
router.post('/add', (req,res,next) =>{
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


module.exports = router;