const express = require('express')
const SiteController = require('../app/controllers/SiteController')
const router = express.Router()

const siteController = require("../app/controllers/SiteController")
const Course = require('../app/models/Course')

//newsController.index()
router.use('/search', siteController.search )
router.use('/page/:page', siteController.pagination)

router.use('/shopping_cart', siteController.shoppingcart )

router.get('/add-to-cart/:id', siteController.addtocart )

router.get('/increase/:id', SiteController.increase)
router.get('/reduce/:id', SiteController.reduce)
router.get('/remove/:id', SiteController.remove)

router.get('/checkout', siteController.checkout )
router.post('/checkout', siteController.post_order )


router.use('/', siteController.index )

module.exports = router