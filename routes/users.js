const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

// require('../config/passport');



router.get('/login', function (req, res) {

    res.render('user/login');

});

router.post('/login', function (req, res, next) {

    passport.authenticate('local', {

        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req, res, next);

});


router.get('/register', function (req, res) {

    res.render('user/register');


});

router.post('/register', function (req, res) {

   let errors  = [];

   if (req.body.password != req.body.password2){

       errors.push({text: "Password does not match"});
   }
   if (req.body.password.length < 4){

       errors.push({text: "Password must be atleast four characters"});
   }

   if (errors.length > 0){

       res.render('user/register', {
           errors: errors,
           name: req.body.name,
           email: req.body.email,
           password: req.body.password,
           password2: req.body.password2
       });

   }else{

       // check if email has been taken or not

       User.findOne({email: req.body.email}).then(function (user) {
           if (user){
               req.flash('msg_error', 'Email has been taken');
               res.redirect('/users/register');
           }else{


               const salt = bcrypt.genSaltSync(10);
               const hash = bcrypt.hashSync(req.body.password, salt);

               const newUser = User({

                   'name': req.body.name,
                   'email': req.body.email,
                   'password': hash

               });

               newUser.save().then(function (user) {

                   req.flash('msg_success', 'User Created Successfully');
                   res.redirect('/users/login');

               });

           }
       });


   }

});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('msg_success', 'You Successfully Logged Out');
    res.redirect('/');
});

module.exports = router;