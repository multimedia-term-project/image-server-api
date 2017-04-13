const mongoose = require('mongoose');

module.exports = mongoose.model('image',{
    url : String,
    name : String,
    userId : String,
    created : Date,
    gps : {
        longitude : Number,
        latitude : Number
    }
});