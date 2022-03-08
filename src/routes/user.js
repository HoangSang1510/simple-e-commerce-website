const express = require('express')
const UserController = require('../app/controllers/UserController')
const router = express.Router()
const passport = require('passport');
//const newsController = require("../app/controllers/NewsController")

//newsController.index()
//router.use('/:slug', newsController.show )
router.get('/a', UserController.show)
router.get('/my_order', UserController.my_order)



router.get('/signin', UserController.signin)
router.get('/signup', UserController.signup)
router.get('/signupSuccess', UserController.signupS)

//new/signup
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/signupSuccess', // chuyển hướng tới trang đăng nhập sau khi đăng ký
    failureRedirect: '/user/signup', // trở lại trang đăng ký nếu có lỗi
    failureFlash: true // allow flash messages
    }));


    // Xử lý thông tin khi có người thực hiện đăng nhập
router.post('/signin', passport.authenticate("local.signin", {
    successRedirect : '/', // Khi bạn điền đúng thông tin đăng nhập thì nó sẽ chuyển hướng bạn đến trang chủ
    failureRedirect : '/user/signin',// trở lại trang đăng nhập nếu có lỗi
    failureFlash : true
    }));


router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    //console.log(req.session.Username)
    res.redirect('/');
});


router.get('/liked/:id/', isLoggedIn,  UserController.liked)
router.get('/unliked/:id/', isLoggedIn,  UserController.unliked)
router.get('/stored/liked/', isLoggedIn,  UserController.storedLiked)

router.post('/comment/:id/', isLoggedIn,  UserController.postComment)
router.post('/rated/:id',isLoggedIn, UserController.postRate)

router.delete('/stored/order/:id', isLoggedIn,  UserController.UserdestroyOrder)


router.use('/', UserController.show )

module.exports = router


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin/');
}

