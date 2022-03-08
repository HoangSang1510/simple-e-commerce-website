
const Product = require('../models/product')
var Cart = require('../models/cart');
var Order = require('../models/order');


const {multipleMongooseToObject} = require('../../util/mongoose');
const session = require('express-session');

class SiteController {
    //[Get] /
    index(req, res, next)
    {   
        //req.session.cart.totalPrice = 0
        var perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
        var page = req.query.page || 1
        

        if(!req.query.orderby)
        {
            // Product.find({})
            // .then(products => { 
            //         var user_like = ""
            //         if(req.user) {
            //             user_like = req.user.liked
            //         }  
            //         res.render('home', {
            //             products: multipleMongooseToObject(products),
            //             liked: user_like
            //         })
            // })
            // .catch(error => next(error))

            Product.countDocuments({})
            .then(
                function(count)
                {
                    return Product.find({})
                        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
                        .limit(perPage)
                        .then(products => { 
                                var user_like = ""
                                if(req.user) {
                                    user_like = req.user.liked
                                }
                                var n= Math.ceil(count / perPage)  
                                var arrpages = Array.from(Array(n), (_,i)=> i+1);
                                res.render('home', {
                                    products: multipleMongooseToObject(products),
                                    liked: user_like,
                                    current: parseInt(page), // page hiện tại
                                    pages: Math.ceil(count / perPage),
                                    arrpages: arrpages,// tổng số các page
                                    orderby: ""
                                })
                        })
                        .catch(error => next(error))
                }
            )    
        }
        else 
        {
            var mysort, orderby
            if (req.query.orderby == "price-desc")
            {
                mysort = { price: -1 }
                orderby = "&orderby=price-desc"
            }
            else 
            {
                mysort = { price: 1 } 
                orderby = "&orderby=price-incr"
            }

            //console.log(orderby)
            Product.countDocuments({})
            .then(
                function(count)
                {
                    return Product.find({}).sort(mysort)
                        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
                        .limit(perPage)
                        .then(products => { 
                                var user_like = ""
                                if(req.user) {
                                    user_like = req.user.liked
                                }
                                var n= Math.ceil(count / perPage)  
                                var arrpages = Array.from(Array(n), (_,i)=> i+1);
                                res.render('home', {
                                    products: multipleMongooseToObject(products),
                                    liked: user_like,
                                    current: parseInt(page), // page hiện tại
                                    pages: Math.ceil(count / perPage),
                                    arrpages: arrpages,// tổng số các page
                                    orderby: orderby
                                })
                        })
                        .catch(error => next(error))
                }
            )

        }
    }

    pagination(req, res, next) 
    {
        let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1

        if(req.query.orderby)
        {
            console.log(req.query.orderby)
        }

        Product.countDocuments({})
        .then(
            function(count)
            {
                return Product.find({})
                    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
                    .limit(perPage)
                    .then(products => { 
                            var user_like = ""
                            if(req.user) {
                                user_like = req.user.liked
                            }
                            var n= Math.ceil(count / perPage)  
                            var arrpages = Array.from(Array(n), (_,i)=> i+1);
                            res.render('home', {
                                products: multipleMongooseToObject(products),
                                liked: user_like,
                                current: parseInt(page), // page hiện tại
                                pages: Math.ceil(count / perPage),
                                arrpages: arrpages// tổng số các page
                            })
                    })
                    .catch(error => next(error))
            }
        )   
      }
    
    // [get] /search
    search(req, res,next)
    {
        //res.send(req.query)
        if(req.query.s && req.query.orderby )
        {
            //console.log("đây")
            var mysort
            if(req.query.orderby == "price-desc")
            {
                mysort = { price: -1 }
            }
            else mysort = { price: 1 }

            //Product.index( { name: "text", description: "text" } )
            Product.find( { $text: { $search: req.query.s } } ).sort(mysort)
                .then(products => { 
                        var user_like = ""
                        if(req.user) {
                            user_like = req.user.liked
                        }  
                        res.render('search', {
                            products: multipleMongooseToObject(products),
                            liked: user_like,
                            search: req.query.s
                        })
                })
                .catch(next)
        }
        else
        {
            Product.find( { $text: { $search: req.query.s } } )
            .then(products => { 
                    var user_like = ""
                    if(req.user) {
                        user_like = req.user.liked
                    }  
                    res.render('search', {
                        products: multipleMongooseToObject(products),
                        liked: user_like,
                        search: req.query.s
                    })
            })
            .catch(next)
        }
    }


    shoppingcart(req, res)
    {
        if (!req.session.cart) {
            return res.render('shopping_cart', {products: null});
        } 
        var cart = new Cart(req.session.cart)
         res.render('shopping_cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
    }

    addtocart(req, res) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        
        //console.log(productId, cart )

        Product.findById(productId, function(err, product) {
           if (err) {
               return res.redirect('/');
           }
            cart.add(product, product.id);
            req.session.cart = cart;
            //console.log(req.session.cart);
            res.redirect('/');
        })

    }

    reduce (req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
    
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/shopping_cart');
    }
    
    remove(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
    
        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/shopping_cart');
    }

    increase(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
    
        cart.increaseByOne(productId);
        req.session.cart = cart;
        res.redirect('/shopping_cart');
    }

    checkout (req, res, next) {
        if (!req.session.cart) {
            return res.redirect('/shopping_cart');
        }
        var cart = new Cart(req.session.cart);
        var errMsg = req.flash('error')[0];
        res.render('checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
    }

    post_order(req, res, next) {
        if (!req.session.cart) {
            return res.redirect('/shopping_cart');
        }
        var cart = new Cart(req.session.cart);
        
        //console.log(cart.items)
         
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            phone: req.body.phone,
        })
        order.save(function(result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        })

    }    

}

module.exports = new SiteController()