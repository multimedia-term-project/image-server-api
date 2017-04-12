const mongoose = require('mongoose');

module.exports = mongoose.model('image',{
    url : String,
    userId : String
});