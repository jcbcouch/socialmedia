const express = require('express')
passport = require('passport')
const multer = require('multer');
router = express.Router(),
mongoose = require('mongoose');
const path = require('path');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/Profile');
const Profile = mongoose.model('profile');

router.get('/', (req, res) => {
    Profile.find()
    .then(profiles => {
        res.render('profiles/all', {profiles})
    })
});

router.get('/me', (req, res) => {
    res.redirect(`/profiles/getprofile/${req.user.id}`)
})

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('profiles/create');
});

router.post('/', ensureAuthenticated, (req, res) => {
    const myProfile = {
        user: req.user.id,
        handle: req.body.handle,
        status: req.body.status
    }
    new Profile(myProfile)
    .save()
    .then(profile => {
        req.flash('success_msg', 'profile added');
        res.redirect(`/profiles`);
    })
  });


  router.get('/getprofile/:userid', (req, res) => {
    Profile.findOne({ user: req.params.userid })
      .then(profile => {
          if(profile.user == req.user.id) {
              console.log('its me!')
              res.render('profiles/me', {profile})
          } else {
          res.render('profiles/profile', {profile})
          }
        })
      //.catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
  });

  router.get('/follow/:userid', (req, res) => {
    Profile.findOne({ user: req.params.userid })
    .then(profile => {
        if(profile.followers.some(f => f.user.toString() === req.user.id)){
            req.flash('error_msg', 'you are already following this user');
            res.redirect('/')
        } else{
        profile.followers.unshift({user: req.user.id})
        profile.save()
        addFollowing() }
    })
    function addFollowing() {
        Profile.findOne({ user: req.user.id })
        .then(profile => {
        profile.following.unshift({user: req.params.userid})
        profile.save()})
        req.flash('success_msg', 'added to your followers');
        res.redirect('/');
    }
    
  })

// Set The Storage Engine
  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

  router.get('/profilepic', (req, res) => res.render('profiles/addpic'));

  router.post('/profilepic', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('index', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('about', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });

module.exports = router;