
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')

const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose')

class MeController {
    //[Get] /me/stored/images
    storedImages(req, res,next)
    {
        Product.find({})
            .then(products => res.render("stored_images", {
                products: multipleMongooseToObject(products)
            }))
            .catch() 
          
    }

    storedUser(req, res,next)
    {
        User.find({})
            .then(users => res.render("User_dashboard", {
                users: multipleMongooseToObject(users),
                layout: 'main'
            }))
            .catch() 
          
    }

    storedOrder(req, res,next)
    {
        Order.find({})
            .then(order => res.render("Order_dashboard", {
                order: multipleMongooseToObject(order),
                layout: 'main'
            }))
            .catch() 
          
    }

    //Put me/liked/:id (item)
    liked(req, res, next)
    {   
        // console.log(req.user._id)
        // console.log(req.params.id)
        //User.updateOne({ _id: req.user._id }, { $push: { liked: [req.params.id] } })
        User.updateOne({ _id: req.user._id }, { $addToSet: { liked: [req.params.id] } })
            .then(() => res.redirect("/"))
            .catch(next)
    }

        //Put me/liked/:id (item)
    unliked(req, res, next)
    {   
        // console.log(req.user._id)
        // console.log(req.params.id)
        //User.updateOne({ _id: req.user._id }, { $push: { liked: [req.params.id] } })
        User.updateOne({ _id: req.user._id }, { $pullAll: { liked: [req.params.id] } })
            .then(() => res.redirect("back"))
            .catch(next)
    }

    storedLiked(req, res, next)
    {   
        //console.log(req.user.liked)
        // console.log(req.params.id)
        // MyModel.find(
        //     {'_id': { $in: ids}}
        //   );
        const list_liked = req.user.liked

        Product.find({'_id': list_liked})
          .then(liked => res.render("Liked_dashboard", {
             liked: multipleMongooseToObject(liked)
          }))
          .catch() 
    }

    //delete me/stored/user/:id
    destroyUser(req, res,next)
    {   
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    destroyOrder(req, res,next)
    {   
        Order.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }
    
    my_order(req, res)
    {
        //console.log(req.session.passport.user)
        Order.find({user: req.session.passport.user })
            .then(order => res.render("Myorder", {
                order: multipleMongooseToObject(order)
            }))
            .catch() 
          
    }
    whouse(req, res,next)
    {   
        //console.log("đây")
        Product.find({})
        .then(product => {
            res.render('warehouse', {
                product: multipleMongooseToObject(product)
            })
        })
        .catch(next)
    }

}

module.exports = new MeController()