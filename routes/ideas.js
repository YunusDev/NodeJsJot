const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

const {ensureAuthenticated} =  require('../helpers/auth');


router.get('/', ensureAuthenticated, function (req, res) {

    Idea.find({user_id: req.user.id}).sort({date: 'desc'}).then(function (ideas) {

        res.render('ideas/index',{ideas: ideas});

    });

});

router.get('/add', ensureAuthenticated, function (req, res) {

    res.render('ideas/add');

});

router.post('/', ensureAuthenticated, function (req, res) {

    const errors = [];

    if (!req.body.title){
        errors.push({text: 'pls add a title'})
    }if (!req.body.details){
        errors.push({text: 'pls add a detail'})
    }

    if (errors.length > 0){

        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user_id: req.user.id,
        };

        new Idea(newUser).save().then(function (idea) {
            req.flash('msg_success', 'Video Idea Added');
            res.redirect('/ideas')
        });
    }

});

router.get('/edit/:id', ensureAuthenticated, function (req, res) {

    Idea.findOne({_id: req.params.id}).then(function (idea) {

        if(idea.user_id != req.user.id ){

            req.flash('msg_error', 'You arent Authorized');
            res.redirect('/ideas');

        }else{

            res.render('ideas/edit', {idea: idea});

        }

    })

});

router.put('/edit/:id', ensureAuthenticated,  function (req, res) {

    Idea.findOne({_id: req.params.id}).then(function (idea) {

        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(function (idea) {
            req.flash('msg_success', 'Video Idea Updated');
            res.redirect('/ideas');
        });

    });

});

router.delete('/delete/:id', ensureAuthenticated, function (req, res) {

    Idea.remove({_id: req.params.id}).then(function () {
        req.flash('msg_success', 'Video Idea Deleted!');
        res.redirect('/ideas');
    });

});

module.exports = router;