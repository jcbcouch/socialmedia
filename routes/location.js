const express = require('express')
passport = require('passport')
router = express.Router(),
mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const {distance} = require('../helpers/distance');

require('../models/Profile');
const Profile = mongoose.model('profile');


router.get('/nearby', ensureAuthenticated, (req, res) => {
    const myLocation = {};
    const radius = req.query.radius;
    Profile.findOne({ user: req.user.id })
      .then(profile => {
          myLocation.longitude = profile.longitude;
          myLocation.latitude = profile.latitude;
          myFunction()
        })


        function myFunction() {
    Profile.find()
      .then(profiles => {
        profiles = profiles.filter(p => p.user !== req.user.id)
        profiles.forEach(prof => {
            let getDistance = distance(prof.latitude, prof.longitude, myLocation.latitude ,myLocation.longitude)
            if(!(isNaN(getDistance))){
                prof.distance = Math.round(getDistance);
            }
            console.log(prof.distance)
        })
        if(radius > 0){
        profiles = profiles.filter(p => p.distance <= radius)
        }
          res.render('nearby', {profiles})
        })
      }
    
  });
  
router.post('/updatelocation', ensureAuthenticated, (req, res) => {

    Profile.findOne({ user: req.user.id })
    .then(profile => {
        profile.longitude = req.body.longitude;
        profile.latitude = req.body.latitude;
        profile.save()
    })

    res.json({msg: 'thanks'})
  })


module.exports = router;