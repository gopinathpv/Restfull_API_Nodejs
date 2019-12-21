const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')
const multer = require('multer')
const Auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/') 
    },
    filename: function(req, file, cb) {
      cb(null,file.originalname) 
    }
  }) 
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true) 
    } else {
      cb(null, false) 
    }
  } 
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  }) 

const Movie = require('../models/movies')

router.get("/", Auth, (req, res, next) => {
    Movie.find()
      .select("moviename year _id movieImage")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          movies: docs.map(doc => {
            return {
              moviename: doc.moviename,
              year: doc.year,
              movieImage: doc.movieImage,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/movies/" + doc._id
              }
            } 
          })
        } 
        res.status(200).json(response) 
      })
      .catch(err => {
        console.log(err) 
        res.status(500).json({
          error: err
        }) 
      }) 
  }) 

router.post('/',Auth,upload.single('movieImage'),(req,res) =>{
    const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
         moviename: req.body.moviename, 
        year: req.body.year,
        movieImage: req.file.path
    }) 
    movie.save().then(result=>{
        console.log("database results",result)
        res.status(201).json({
            message : "Created movie Succesfully",
            createMovie:{
                moviename: result.moviename,
                year:result.year,
                _id: result._id,
                request:{
                    type:"GET",
                    url : "http://localhost:3000/movies/" + result.id
                }
            }
        })
    })
    .catch(err =>{console.log(err) 
    res.status(500).json({
        error:err
    }) 
    }) 
}) 


router.get('/:movieId',Auth,(req,res) =>{
const id= req.params.movieId 
Movie.findById(id)
.select('moviename year _id movieImage')
.exec()
.then(doc=>{
    console.log(doc) 
    if(doc){
        res.status(200).json({
            movie:doc,
            message: "Create Movie",
            request:{
                type: 'GET',
                url: 'http://localhost:3000/movies'
            }
        }) 
    }
    else{
        res.status(404).json("invalid response") 
    }
})
.catch(err=>{console.log(err) 
res.status(500).json(err) 
}
)
}) 

router.patch('/:movieId', Auth,(req,res) =>{
    const id = req.params.movieId 
    const update = {} 
    for(const vals of req.body){
        update[vals.propName] = vals.value 
    }
    Movie.update({_id:id}, {$set: update})
    .exec().then(results => {
        console.log(results)
        res.status(200).json({
            message: " Movie update",
            request:{
                type: 'GET',
                url: 'http://localhost:3000/movies' + id
            }
        }) 

    }).catch(err =>{
        console.log(err) 
res.status(500).json({err})
    })
}) 


router.delete('/:movieId',Auth,(req,res) =>{
   const id = req.params.movieId 
   Movie.remove({_id:id})
   .exec()
   .then(result=> {
       res.status(200).json({
           message: "Movie Deleted",
           request:{
               type:'POST',
               url:'http://localhost:3000/movies',
               body:{moviename:'String',year:'Number'}
           }
       }) 
   })
   .catch(err =>{console.log(err) 
    res.status(500).json({
        error:err
    }) 
}) 
}) 
module.exports =router 
