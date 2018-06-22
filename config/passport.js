const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');


module.exports = function (passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function(email, password, done) {

            User.findOne({email: email}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'User Not Found'});
                }

                if (!bcrypt.compareSync(password, user.password)){

                    return done(null, false, {message: 'Password does not match'})
                }

                return done(null, user);

            });

        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

};

