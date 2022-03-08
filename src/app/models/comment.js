var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    target: {type: Schema.Types.ObjectId, ref: 'Product'},
    by: {type: Schema.Types.ObjectId, ref: 'User'},  
    username: {type: String, default: "NameLess"},
    cmtbody: {type: String},
},  {timestamps: true,});

module.exports = mongoose.model('Comment', commentSchema);

