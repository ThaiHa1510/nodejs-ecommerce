/**
* Config file
*/
var fs=require('fs');
var path=require('path');
var basename=path.basename(__filename);
var config={};
fs.readdirSync(__dirname).filter(file=>{
    return (file.indexOf('.')!==0)&&(file !== basename) && (file.slice(file.length-3)==='.js');
}).forEach(file=>{
   // setConfigFile(file);
   let name=file.slice(0,file.length-3);
    let value=require((path.join(__dirname,name)));
    config[name]=value;
    
})

module.exports=config;