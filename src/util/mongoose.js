//hàm chuyển kiểu dữ liệu vể thành object để hbs đọc
module.exports = {
    multipleMongooseToObject: function(mongooseArray) {
        return mongooseArray.map(mongoose => mongoose.toObject()) //mongoose array to object
    },
    mongooseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose //mongoose to object
    }
}