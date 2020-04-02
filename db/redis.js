'use strict '
const redis =require('async-redis');
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});
client.on('connect',()=>{
    console.log("Connected Redis Server");
});
var setValue = async(key, value) => {
    return await client.set(key, value);
  };
  
var getValue = async(key) => {
        let val = await client.get(key);
        return val;
    };
module.exports={RedisClient:client,AsyncsetValue:setValue,AsyncgetValue:getValue}