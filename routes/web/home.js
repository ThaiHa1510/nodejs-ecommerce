module.exports = function (db, app) {
  let express = require('express');
  let session = require('express-session');
  const sequelize = require("sequelize");
  //let db = require('./../../database/app');
  let route = express.Router();
  //let db = require('../database/config');
  route.use(function (req, res, next) {
    let carts = req.cookies.cartShop;
    //console.log(carts);
    let totalPrice = 0;
    if (carts) {
      carts.forEach(item => {
        totalPrice += item.price;
      })
    }

    app.locals.cart = carts;
    app.locals.totalPrice = totalPrice;
    next();
  });
  route.get('/', function (req, res) {
    let Products = db.products;
    Products.findAll().then(product => {

      res.render('home', {
        title: 'Home',
        products: product
      });
    });


  });
  route.get('/shop', function (req, res) {
    let Products = db.products;
    Products.findAll().then(product => {
      res.render('products', {
        title: 'Shop page',
        products: product
      });
    });


  });
  route.get('/page', function (req, res) {
    res.render('page', {
      title: "Blog"
    });
  });
  route.get('/product-detail/:id', async function (req, res) {
     let review= await db.Reviews.findAll({where: {
      ProductId: req.params.id
    }});
     let Product = await db.products.findOne({
       where:
       {
         id:req.params.id
       }
     });
     res.render('product-detail', {
      title: 'Detail page',
      product: Product,
      review: review
    });

     
/**
      let Reviews = db.Reviews;
      Reviews.findAll({where: {
        ProductId: req.params.id
      }}).then(reviews => {
        console.log(Products);
        res.render('product-detail', {
          title: 'Detail page',
          product: Products,
          review: reviews
        });
      })
*/
  });
  route.post('/add-reiview/:id',function (req,res){
    let Reviews=db.Reviews;
    let firstName=req.body.fullName.split(" ")[0];
    let fullName=req.body.fullName.split(" ");
    fullName.shift();
    Reviews.create({
      detail:req.body.content,
      scope:req.body.scope,
      ProductId:req.params.id,
      firstName:firstName,
      email:req.body.email,
      lastName:fullName,
      createAt:new Date(),
    })
    res.json({
      ok:"them review thanh cong"
    });
  })
  route.get("/review",function(req,res){
    (async () => {
      // await sequelize.sync();
       const jane = await db.Reviews.findAll( );
       res.send(jane);
     })();

  })
  /**
  route.get('/add-to-cart/:id', function(req, res) {
   
    let Products=db.products;
    Products.findAll({
      where:{
        id:req.params.id
      }
    }).then(product => {
      res.render('products',{title:'Shop page',
      products:product});
    });
    
    
  });
  */
  route.get('/checkout', function (req, res) {
    //res.send('<h1>About page</h1>');
    res.render('order', {
      title: 'Checkout'
    });
  });
  route.post('/update-cart', function (req, res) {
    //console.log(req.cookies.node_express_ecommerce);
    let products = req.cookies.node_express_ecommerce;
    products.forEach(function (product, index) {
      product.qnt = req.body.qnt[index];
    });
    //console.log(req.body)
    res.clearCookie('cartShop', {
      path: '/'
    });
    res.cookie('cartShop', products);
    res.redirect('/cart');
  });
  route.get('/cart', function (req, res) {
    let products = [];
    //let session_products = [];

    //Using cookies
    //console.log(req.cookies.node_express_ecommerce);
    if (req.cookies.node_express_ecommerce) {
      res.render('cart', {
        title: 'Cart',
        products: req.cookies.node_express_ecommerce
      });
    } else {
      res.render('cart', {
        title: 'Cart',
        products: products
      });
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
  async function findProduct(){
    const result = await db.products.findAll();
    return result;
    //console.log(result);
  
  }
  return route;
};