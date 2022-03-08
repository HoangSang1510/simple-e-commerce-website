
const Product = require('../models/product')
const Comment = require('../models/comment')
const Rate = require('../models/rate')

const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose')



class ProductController {


    //[Get] /product/:slug => /product/:id
    show(req, res, next)
    {   

        // Rate.count({target : req.params.id}, function( err, count){
        //     console.log( "Number of rated:", count );
        // })

        // Rate.find({target : req.params.id}, function( err, rate){
        //     //console.log( "rated:", rate );
        //     var sumstar = 0
        //     //console.log(rate.length)
        //     for (const element of rate) {
        //         sumstar = sumstar + element.star
        //       }
        //     //console.log(sumstar);
        // })

        // //Phép màu, k hiểu sao đoạn này lại chạy đc
        // Comment.find({target : req.params.id}, function(err, com) {
        //     if(err)
        //       return null;
        //     else
        //       //res.json(com)
        //         Product.findOne({ _id : req.params.id})
        //             .then(product => {
        //                 res.render('detail', {
        //                     product: mongooseToObject(product),
        //                     cmt: multipleMongooseToObject(com),
        //                 })
        //             })
        //             .catch(next)
        //       return com} )

 
            Comment.find({target : req.params.id})
            .then(
                function(com) 
                { 
                    //console.log(com)
                    return Rate.find({target : req.params.id})
                        .then(
                            function (rate) 
                            {
                                var sumstar = 0
                                //console.log(rate.length)
                                if(rate.length != 0)
                                {
                                    for (const element of rate) {
                                        sumstar = sumstar + element.star
                                      }
                                    var tb = sumstar / rate.length
                                }
                                else
                                {
                                    var tb = 0 
                                }
                                
                                if(req.user)
                                {
                                    //console.log("vào đây")
                                    return Rate.findOne({target : req.params.id, by: req.user._id})
                                        .then(
                                            function (userrate)
                                            {
                                                if(userrate)
                                                {
                                                    var urate = userrate.star
                                                }
                                                else{ 
                                                    var urate = -1
                                                }
                                                
                                                //console.log(urate)
                                                return Product.findOne({ _id : req.params.id})
                                                .then(product => {
                                                        res.render('detail', {
                                                            product: mongooseToObject(product),
                                                            cmt: multipleMongooseToObject(com),
                                                            f_rate: tb,
                                                            user_rate: urate,
                                                            totalrate: rate.length
                                                            
                                                        })
                                                    })
                                                .catch(next)
                                            }
                                        )
                                }
                                else
                                {
                                    return Product.findOne({ _id : req.params.id})
                                    .then(product => {
                                            res.render('detail', {
                                                product: mongooseToObject(product),
                                                cmt: multipleMongooseToObject(com),
                                                f_rate: tb,
                                                totalrate: rate.length
                                                
                                            })
                                        })
                                    .catch(next)
                                }
                                 
                            }
                        )
                        .catch(next)
                } )
            .catch(next)
            

    }
    //Get detail/create
    create(req, res, next)
    {   
        res.render("create")
    }

    //Post detail/store
    store(req, res, next)
    {   
        //console.log("dd")
        //res.json(req.body)
        const prod = new Product(req.body)
        prod.save()
            .then(() => res.redirect("/"))
            .catch(error => {      
            })
    }

    //Get detail/:id/edit
    edit(req, res, next)
    {   
        Product.findById(req.params.id)
        .then(product => {
            res.render('edit', {
                product: mongooseToObject(product)
            })
        })
        .catch(next)
    }

    //put detail/:id
    update(req, res,next)
    {   

        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/'))
            .catch(next)
    }

    update_warehouse(req, res,next)
    {   

        Product.updateOne({ _id: req.params.id }, req.body)
            .then(
                function()
                {
                    req.flash('success', 'Success!!')
                    return res.redirect('back')
                }
            )
            .catch(next)
    }

    //delete detail/:id
    destroy(req, res,next)
    {   
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

}

module.exports = new ProductController()
