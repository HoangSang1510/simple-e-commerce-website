const mongoose = require('mongoose')

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

const Schema = mongoose.Schema;

const product = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},
  image:  { type: String},
  slug: { type: String, slug: "name", unique: true},
  price: { type: Number, default: 0, required: true},
  quantity: { type: Number, default: 10},
  discount: { type: Number, default: 0},

}, {timestamps: true,});

product.index({description: 'text'});

module.exports = mongoose.model('Product', product)