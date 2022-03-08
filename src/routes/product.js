const express = require('express')
const router = express.Router()

const productController = require("../app/controllers/ProductController")

//newsController.index()
router.get('/create', isLoggedIn, isAdmin, productController.create)
// router.put('/rated/:id', productController.updatestar)

router.post('/store', isLoggedIn, isAdmin, productController.store)
router.get('/:id/edit', isLoggedIn, isAdmin,  productController.edit)
router.put('/:id', isLoggedIn, isAdmin, productController.update)
router.put('/:id/warehouse', isLoggedIn, isAdmin, productController.update_warehouse)
router.delete('/:id', isLoggedIn, isAdmin, productController.destroy)
router.get('/:id', productController.show)

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