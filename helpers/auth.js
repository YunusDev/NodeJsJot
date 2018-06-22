module.exports  =  {

    ensureAuthenticated: function (req, res, next) {

        if(req.isAuthenticated()){

            return next();

        }
        req.flash('msg_error', 'You arent authorized man!');
        res.redirect('/users/login');

    }


}