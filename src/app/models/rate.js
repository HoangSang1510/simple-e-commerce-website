var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rateSchema = new Schema({
    target: {type: Schema.Types.ObjectId, ref: 'Product'},
    by: {type: Schema.Types.ObjectId, ref: 'User'},  
    username: {type: String, default: "NameLess"},
    star: {type: Number},
},  {timestamps: true,});

module.exports = mongoose.model('Rate', rateSchema);

