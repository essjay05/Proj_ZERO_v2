// REQUIRE EXPRESS AND ROUTERS
const
    express = require('express'),
    usersRouter = new express.Router(),
    passport = require('passport'),
    User = require('../modelsUser');

// RENDER LOGIN VIEW
usersRouter.get('/login', (req, res) => {
    res.render('index', { message: req.flash('loginMessage') })
});

// AUTHENTICATING LOGIN
usersRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/users/profile',
    failureRedirect: '/'
}));

// RENDER SIGNUP VIEW
usersRouter.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('signupMessage') })
});

// AUTHENTICATING SIGNUP (CREATE)
usersRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup'
}));

// SHOW PROFILE MUST BE LOGGED IN (READ)
usersRouter.get('/profile', isLoggedIn, (req, res) => {
    User.findById(req.user._id)
        .exec((err, user) => {
            if (err) res.json({ success: false, err });
            res.render('profile', { success: true, user });
    })
});

// RENDER FORM TO EDIT PROFILE
usersRouter.get('/profile/edit', isLoggedIn, (req, res) => {
    res.render('editProfile');
});

// UPDATE PROFILE (UPDATE)
usersRouter.patch('/profile', isLoggedIn, (req, res) => {
    // CHECK TO SEE IF THE REQUEST BODY HAS A TRUTHY PASSWORD KEY... MEANING THE USER IS TRYING TO MODIFY PASSWORD
    Object.assign(req.user, req.body);
    req.user.save(( err, updatedUser ) => {
        if (err) console.log(err);
        res.redirect('/users/profile');
    })
});

// LOGOUT
usersRouter.get('/logout', (req, res) => {
    // DESTROY THE SESSION AND REDIRECT USER TO THE SPLASH PAGE
    req.logout();
    res.redirect('/');
});

// MIDDLEWARE:
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

module.exports = usersRouter;