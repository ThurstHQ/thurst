module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', function (req, res, next) {
            passport.authenticate('local-signup', function (err, user, info) {
                if (err) {
                    console.log(err);
                    return res.status(401).send({message: err.message})
                }
                passportAuthLogic(err, res, req, next, user);
                })(req, res, next)
        }
    );

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function passportAuthLogic(err, res, req, next, user) {
    if (err) {
        // return next(err);
        return res.status(401).send({message: err.message});
    }
    if (!user) {
        return res.status(401).send({message: req.signMessage});
    }

    req.logIn(user, function (err) {
        if (err) {
            return next(err);
        }
        var payload = {
            id: user._id,
            salt: user.salt
        };
        var token = jwt.sign(payload, settings.config.tokenSalt);

        return res.send({user: user, token: token});
    });
}