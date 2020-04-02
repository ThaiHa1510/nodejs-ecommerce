' use strict'
module.exports=function (db,app){
    const {RedisClient,AsyncgetValue,AsyncsetValue}=require(__dirname+'/../../db/redis');
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
    /**
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
    */
   route.use('/api/',login);
    route.get('/api/logout',logout);
    route.get('/blacklist',async (req,res)=>{
        const result = await RedisClient.lrange('token',0,99999999);
        res.send(result);
    })
    route.get('/api/msg',function(req,res){
        res.send({
            msg:req.body.username
        });
    });
    async function logout(req, res,next) {
        // logout user
        // save token in redis
        const token = req.headers.authorization.split(' ')[1];
        try {
            await RedisClient.LPUSH('token', token);
            return res.status(200).json({
              'status': 200,
              'data': 'You are logged out',
            });
        } catch (error) {
          return res.status(400).json({
            'status': 500,
            'error': error.toString(),
          });
        };
    }
    async function login(req,res,next){/* .......redis validation .........*/
        try {
            const token = req.headers.authorization.split(' ')[1];
            const result = await RedisClient.lrange('token',0,99999999)
            if(result.indexOf(token) > -1){
              return res.status(400).json({
                status: 400,
                error: 'Invalid Token'
            })
          }
        /* ...... ............................*/
         const decrypt = await jwt.verify(token, privateKey);
          const user= await db.User.findOne({where:{id:decrypt.id}});
          // check if token has expired
          if (!user) {
            return res.status(403).json({
              status: 403,
              error: ' Token Not accessible',
            });
          }
        
          next();
        } catch (error) {
          return res.status(501).json({
            status: 501,
            error: error.toString(),
          });
        }
        }
    return route;
}