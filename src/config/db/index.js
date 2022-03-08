
const mongoose = require('mongoose')


async function connect()
{   
    try{
        //await mongoose.connect('mongodb://localhost/my_database')

        await mongoose.connect('mongodb+srv://DgSg:Sg15101999@cluster0.grhd3.mongodb.net/f8_edu_dev?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connect Success") 
    }
    catch(error){
        console.log("Connect fail") 
    }
    
}

module.exports = { connect }