const express = require('express') 
const app = express() 
const morgan = require('morgan') 
const bodyparser = require('body-parser') 
const mongoose = require('mongoose') 

const movieRoutes = require('./api/routes/movies') 
const UserRoutes = require('./api/routes/user') 

mongoose.connect('mongodb+srv://admin:'+process.env.MONGO_PASS + '@rest-shop-lij7y.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology:true })
app.use(morgan('dev')) 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()) 

app.use('/movies', movieRoutes) 
app.use('/user', UserRoutes) 


app.use((req,res,next)=>{
    const error = new Error('Not Found') 
    error.status(404) 
    next(error)
})

app.use('/uploads',express.static('uploads')) 

app.use((req,res,next)=>{
    res.header('Access-contol-Allow-origin','*')
    res.header('Access-contol-Allow-header',"Origin,X-Requested-With, Content-Type, Accept, Authorization") 
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE,COPY,HEAD,OPTIONS')
        return response.status(200).json({})
    }
    next() 
})

app.use((err,req,res,next)=>{
  res.status(err.status || 500) 
  res.json({
      err: {
          message :err.message
      }
  })
})
module.exports = app 