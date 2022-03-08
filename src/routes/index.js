const userRouter = require('./user')
const adminRouter = require('./admin')
const siteRouter = require('./site')
const productRouter = require('./product')

function route(app)
{

    app.use("/user", userRouter)
    app.use("/product", productRouter)
    app.use("/admin", adminRouter)
    app.use("/", siteRouter) //để ở dưới cùng để đảm bảo
    

    // app.get('/search', (req, res) => {
    //     //console.log(req.query.q)
    //     res.render('search')
    //   })
      
    // app.post('/search', (req, res) => {
    //     console.log(req.body)
    //     res.send('OK')
    //   })
}

module.exports = route