const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const token = require('jsonwebtoken')
const User = require('../models/user')
const Auth = require('../middleware/auth');


router.post("/signup",(req,res)=>{
    User.find({username: req.body.username})
    .exec()
    .then(user =>{
        if(user.length>=1){
            return res.status(409).json({
                message:"username exist"
            })
        }
    })
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password,10 , (err,hash) =>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username:req.body.username,
                password:hash
            })
            user.save()
            .then(result=>{
                console.log(result)
                  res.status(201).json({
                    message:'User Created'
                })
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json({
                    error:err
                })
            })
        }
    })
})
})

router.post("/login",(req,res)=>{
User.find({username: req.body.username})
.exec()
.then(user=>{
    if(user.length<1){
        return res.status(401).json({
            message:'Username not found'
        })
    }
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
        if(err){
           return res.status(401).json({
                error:err
            })
        }
        if(result){
            const value = token.sign({
                username: user[0].username,
                userId: user[0]._id
            },
            'secret',
            {
                expiresIn: "2h"
            }
            )
            return  res.status(200).json({
                message:"Authentication Success",
                value : value

            })
        }
            res.status(401).json({
                message:'Authentication failed'

            })
    })
})
.catch(err =>{
     res.status(500).json({
        error:err
    })
})
})
router.delete('/:userId'),Auth,(req,res,next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result=>{
         res.status(200).json({
            message:"User deleted"
        })
    .catch(err =>{
         res.status(500).json({
            error:err
        })
    })
    })
}
module.exports= router