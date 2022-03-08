// config/passport.js
// load các module
const passport = require('passport')
const session = require('express-session');

const {multipleMongooseToObject} = require('../util/mongoose');
// load user model

const User = require('../app/models/user')
//const User = require("C:/Users/Sang -PC/Desktop/node/src/app/models/user.js")

const LocalStrategy = require('passport-local').Strategy
// passport session setup
// used to serialize the user for the session
passport.serializeUser(function(user, done)
{
    ////cách 1: trong session passport sẽ có giá trị là id
    done(null, user.id)
    //done(null, user.email)
})

// used to deserialize the user
passport.deserializeUser(function(id, done)
{
    ////cách 1: trong session passport sẽ có giá trị là id, cách 2 sẽ hiện email
    User.findById(id, function(err, user){
    done(err, user);})

    // User.find({ email: id }, function(err, user){
    // done(err, user);})
})

// local sign-up
passport.use('local.signup',new LocalStrategy({
    // mặc định local strategy sử dụng username và password
    //chúng ta có thể cấu hình lại
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true // cho phép chúng ta gửi reqest lại hàm callback
    },function(req, email, password, done){
    // Tìm một user theo email
    // chúng ta kiểm tra xem user đã tồn tại hay không

        User.findOne({ 'email': email }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
            return done(null, false, { message : 'Email is already in use.'})
            }
            // Nếu chưa user nào sử dụng email này
            // tạo mới user
            var newUser= new User();
            // lưu thông tin cho tài khoản local

            newUser.first_name = req.body.first_name;
            newUser.last_name = req.body.last_name;
            newUser.username = req.body.first_name + " " + req.body.last_name;
            newUser.email= email;
            newUser.password= newUser.encryptPassword(password);
            // lưu user
            newUser.save(function(err, result){
            if(err){
                return done(err)
            }
            req.session.Useremail = email
            req.session.Username = req.body.first_name + " " + req.body.last_name;
            return done(null, newUser);
            })
        });
    }
));


// config/passport.js
// local sign-in
passport.use('local.signin',new LocalStrategy({
    // mặc định local strategy sử dụng username và password chúng ta có thể cấu hình lại
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    // cho phép chúng ta gửi reqest lại hàm callback
    },function(req, email, password,done) {
        // tìm một user với email
        // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
        User.findOne({ 'email': email }, function(err, user) {
            if (err) { return done(err); }
            // Nếu không có user thì in ra lỗi
            if (!user) {
                return done(null, false, { message : 'Not user found'})
            }
            if(!user.validPassword(password)){
                //console.log('Wrong password')
                return done(null,false,{message:'Wrong password'})
            }
            req.session.Useremail = email
            req.session.Username  = user.username
            req.session.Userliked = user.liked
            //console.log(typeof(req.session.Userliked))
            return done(null, user); 
        });
    }
 ));