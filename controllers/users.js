const User = require('../models/user')


//form page to register a user
module.exports.userRegisterForm = async(req, res) => { //route to get FORM in register.ejs
    res.render('users/register');
};

//actually register a user
module.exports.registerUser = async (req, res, next) => { //"next" is added for req.login
    try {
        const {username, password, email} = req.body//destructure what you want from req.body
        const user = new User({username, email})//pass username and email into a new user
        //take the "user", instance of User model, and its password and hash&salt and store them all
        const registeredUser = await User.register(user, password);//register user/save to dtbse
        req.login(registeredUser, err => { //after rgstring user, automtclly log him in 
            if(err) return next(err);//throw error if error happens during logging a user in
            else { //if there is no error during logging a user in...
                    req.flash('success','Registered'); //then execute flash message
                    res.redirect('/campgrounds'); //then redirect the user to this page
                 }
        })
       
    }
    
    catch (e) { // this error "e" itself contains message
        req.flash('error', e.message);//if problem arises during registration, flash message
        res.redirect('register');//redirect the user back to register page
    }
};

//form page to login
module.exports.loginForm = (req, res) => { //route to get FORM in login.ejs
    res.render('users/login');
};


//login - username & password authenticate
module.exports.loginAuthenticate = function (req, res) {
    req.flash('success','Welcome');
    
    //if user was in a URL, return him to his path after he logs in or registers in
    //or if user directly goes to login or register, redirect to /campgrounds after loggn or rgst
    const redirectUrl = req.session.returnTo || '/campgrounds';//redirect to URL "or" /Campground
    delete req.session.returnTo; //delete "returnTo" frm session aftr redrcting user to his path
    res.redirect(redirectUrl);
};

//user logout
module.exports.userLogout = (req, res) => {
    req.logout(function(err) {
        if(err){return next(err);}
        req.flash('success', 'You have logged out');
        res.redirect('/campgrounds');
    });
    
}
