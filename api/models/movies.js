const mongoose = require('mongoose')
const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    moviename: {type:String , required:true}, 
    year: {type:Number , required:true},
    movieImage :{type:String,required:true}
})

module.exports = mongoose.model('Movie',movieSchema)