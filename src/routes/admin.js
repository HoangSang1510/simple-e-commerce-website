const express = require('express')
const router = express.Router()

const adminController = require("../app/controllers/AdminController")

//newsController.index()
// router.get('/liked/:id/',  meController.liked)
// //router.get('/my_order', meController.my_order)
// router.get('/unliked/:id/',  meController.unliked)
// router.get('/stored/liked/', isLoggedIn,  meController.storedLiked)

router.get('/stored/images/', isLoggedIn, isAdmin,  adminController.storedImages)

router.get('/stored/user/', isLoggedIn, isAdmin ,  adminController.storedUser)

router.delete('/stored/user/:id', isLoggedIn, isAdmin ,  adminController.destroyUser)
router.delete('/stored/order/:id', isLoggedIn, isAdmin ,  adminController.destroyOrder)

router.get('/stored/warehouse', adminController.whouse)

router.get('/stored/order/', isLoggedIn, isAdmin,  adminController.storedOrder)







module.exports = router

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}

function isAdmin(req, res, next) {
    if (req.user.role == "Admin") {
        return next();
    }
    res.render('Error');
}