const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

const router = express.Router();

require('../models/Idea');
const Idea = mongoose.model('idea');

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {ideas})
    })
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({ text: 'please add a title' });
    }
    if(!req.body.details) {
        errors.push({ text: 'please add some details' });
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
    new Idea(newUser)
    .save()
    .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
    })
    }
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if(idea.user != req.user.id){
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea:idea
        });
      }
      
    });
  });

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        })
    })
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
      .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
      });
  });

module.exports = router;