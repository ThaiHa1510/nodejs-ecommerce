' use strict'
module.exports=function (db,app){
    const express=require("express");
    const fs=require('fs');
    const route=express.Router();
    var jwtDecode = require('jwt-decode');
    const jwt=require("jsonwebtoken");
    var privateKey = fs.readFileSync('./private-key.pem', 'utf8');
    route.post('/user/login',function(req,res){
        var User=db.User;
        var {body}=req;
        var {username}=body;
        var {password}=body;
        User.findOne({
            where:{
                username:username,
            }
        }).then(result=>{
            console.log(result);
            if(result){
               
                jwt.sign({id:result.id,name:result.username},privateKey,{ algorithm: 'HS256',expiresIn: '1h' },(err, token) => {
                    if(err) { console.log(err) }    
                    res.json({access_token:token});
                });
            } else {
                console.log('ERROR: Could not log in');
            }
            
        });
        
    });
    route.use('/api/',function(req,res,next){
        if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]){
            let token=req.headers.authorization.split(" ")[1];
            jwt.verify(token,privateKey,function(err,decode){
                if(err){
                    return res.status(403).send({
                        message:"Token invalid"
                    });

                }
                else{
                    let base64Url=token.split(".")[1];
                    var decodedValue = jwtDecode(token);
                    req.body.user_id=decodedValue.id;
                    req.body.username=decodedValue;
                    console.log(decodedValue.name);
                     next();
                }
            });
        }
        else{
            return res.status(403).send({
                message:"Unauthorization"
            });
        }
    });
    route.get('/api/msg',function(req,res){
        res.send({
            msg:req.body.username
        });
    });
    return route;
}