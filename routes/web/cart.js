module.exports=function(db,app){
    let express = require('express');
let session = require('express-session');
//let db = require('./../../database/app');
let route = express.Router();
//let db = require('../database/config');

route.get('/add-to-cart/:id', function(req, res) {
  let cookie=[];
  let ProductsModel=db.products;
  if(req.cookies.cartShop){
    cookie=req.cookies.cartShop;
    ProductsModel.findOne({
      where:{
          id:req.params.id
      }
  }).then(result=>{
    
    let flag=false;

    cookie.forEach(product => {
      
        if(product.id === result.id){
          
            flag=true;
        }
    });
    if(!flag){
      cookie.push(result);
      
    } 
    res.cookie('cartShop', cookie, {path:'/'});
      res.redirect('/shop');   
  });
  }
  else {
    cookie=[];
    ProductsModel.findOne({
      where:{
          id:req.params.id
      }
  }).then(result=>{
   // console.log(result);
    cookie.push(result);
    res.cookie('cartShop', cookie, {path:'/'});
      res.redirect('/shop');
  });
     }
  
  
  
  
  
});
route.post('/add-to-cart/:id', function(req, res) {
  let cookie=[];
  let ProductsModel=db.products;
  if(req.cookies.cartShop){
    cookie=req.cookies.cartShop;
    ProductsModel.findOne({
      where:{
          id:req.params.id
      }
  }).then(result=>{
    
    let flag=false;

    cookie.forEach(product => {
      
        if(product.id === result.id){
            flag=true;
        }
    });
    if(!flag){
      cookie.push(result);
      
    } 
    res.cookie('cartShop',Object.assign({},cookie),{path:'/'})
    res.json(Object.assign({},cookie));
  });
  }
  else {
    cookie=[];
    ProductsModel.findOne({
      where:{
          id:req.params.id
      }
  }).then(result=>{
   // console.log(result);
    cookie.push(result);
    res.cookie('cartShop',Object.assign({},cookie),{path:'/'})
    res.json(Object.assign({},cookie));
  });
     }
});
route.get('/checkout', function(req, res) {
  //res.send('<h1>About page</h1>');
  res.render('order', {title: 'Checkout'});
});
route.post('/update-cart', function(req, res) {
  //console.log(req.cookies.node_express_ecommerce);
  let products = req.cookies.cartShop;
  products.forEach(function(product, index) {
    product.qnt = req.body.qnt[index];
  });
  //console.log(req.body)
  res.clearCookie('cartShop', {path:'/'});
  res.cookie('cartShop', products);
  res.redirect('/cart');
});
route.get('/cart', function(req, res) {
  
  if(req.cookies.cartShop) {
    res.render('cart', {title: 'Cart'});
  } else {
    res.render('cart', {title: 'Cart'});
  }
  
  //Using session
  /*if(req.session.product) {
    req.session.product.forEach(function(product) {
      session_products.push(product.id);
    });
    session_products = session_products.join("\', \'");
    db.query("SELECT * FROM products left join categories on categories.id=products.category where pid in('"+session_products+"')", function (err, result, fields) {
      if (err) {
        throw err;
      } else {
        //console.log(result);
        res.render('cart', {title: 'Cart', products: result});
      }
    });
  } else {
    res.render('cart', {title: 'Cart', products: products});
  }*/
});
/** Remove cart item */
route.get('/remove-from-cart/:id', function(req, res) {
  let id=req.params.id;
  let cookie=req.cookies.cartShop;
    for(var i= 0;i<cookie.length;i++){
      if( cookie[i].id == id){
        cookie.splice(i, 1);
        i--;
      };
      console.log(cookie);
    }
      
     
   // console.log(cookie);
    res.cookie('cartShop', cookie, {path:'/'});
      res.redirect('/cart');   
  });
route.get('/empty-cart',function(req,res){
  res.cookie('cartShop', [], {path:'/'});
      res.redirect('/cart'); 
});
route.get('/product-detail/:id',function (req,res){
  
})
return route;
};