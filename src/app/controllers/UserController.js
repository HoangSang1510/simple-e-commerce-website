const User = require('../models/user')
const Order = require('../models/order')
const Product = require('../models/product')
const Comment = require('../models/comment')
const Rate = require('../models/rate')

const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose')
const session = require('express-session');

class UserController {
    //Get / news/
    // index(req, res)
    // {
    //     res.render('news')
    // }

    // [get] /news/:slug
    signin(req, res)
    {
        var messages = req.flash('error');
        res.render("signin", { messages: messages, hasErrors: messages.length > 0})
    }

    show(req, res)
    {
        //console.log(typeof(req.session))
        //res.json(req.session)
        //res.json(req.user)
        res.render("req",{reqsession: JSON.stringify(req.session) , requser: JSON.stringify(req.user)})
    }

    signup(req, res)
    {   
        var messages = req.flash('error');
        res.render("signup", { messages: messages, hasErrors: messages.length > 0})
    }

    signupS(req, res)
    {   
        res.render("signupSuccess")
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

    //Put user/liked/:id (item)
    liked(req, res, next)
    {   
        // console.log(req.user._id)
        // console.log(req.params.id)
        //User.updateOne({ _id: req.user._id }, { $push: { liked: [req.params.id] } })
        User.updateOne({ _id: req.user._id }, { $addToSet: { liked: [req.params.id] } })
            .then(() => res.redirect("back"))
            .catch(next)
    }

        //Put user/unliked/:id (item)
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
    UserdestroyOrder(req, res,next)
    {   
        Order.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // POST /user/comment/:id
    postComment(req, res,next)
    {   
  
        //console.log("dd")
        //res.send("abc")
        //res.json(req.body)
        //const cmt = new Comment(req.body)
        const cmt = new Comment({
            target: req.params.id,
            by: req.user,
            username: req.user.username,
            cmtbody: req.body.cmtbody,
        })
        cmt.save()
        //res.send("Thêm thành công!!!")
            .then(() => res.redirect("back"))
            .catch(error => {      
            })

    }

    postRate(req, res, next)
    {   
        //console.log(req.params.id)
        //console.log(req.body)
        //res.send(req.body)

        const rt = new Rate({
            target: req.params.id,
            by: req.user,
            username: req.user.username,
            star: req.body.rate,
        })
        rt.save()
        //res.send("Thêm thành công!!!")
            .then(() => res.redirect("back"))
            .catch(error => {      
            })
    }
}

module.exports = new UserController