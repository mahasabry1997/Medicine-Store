const Product = require('../models/product');
const Sensor = require('../models/sensor')
const Order = require('../models/order');
const user = require('../models/user');
const nodemailer = require('nodemailer');
const bodyparser = require("body-parser");
const isAdmin = require('../middleware/is-admin');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs')
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      products.sort();
      products.reverse();
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      products.sort();
      products.reverse();
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSensors = (req, res, next) => {
  Sensor.find(function(err, sensors) {
    if (err) return console.error(err);
    //console.log("existing todos are: ", todos);
    // render index page, passing todos as local variable
    var x = sensors.reverse();
    res.send(x);
    //res.render('index', {
      //  todos: todos
   //});

    })
    .catch(err => console.log(err));
};
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      // products.sort();
      products.reverse();
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
   
     
      const order = new Order({
    
        user: {
          email: req.user.email,
          userId: req.user

        },
        contact: {
          address : req.body.address,
          phone: req.body.phone
        },
          products: products

      });
      console.log(products)
      transporter.sendMail({
        to: 'hady.elhossiny1132@gmail.com',
        from: 'SmartStore@node-complete.com',
        subject: 'Orders!',
        html:'hello'
      });
      
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    

 
    .then(() => {
      res.redirect('/orders'); 
      
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const email=req.user.email;
  const admin ='hady.elhossiny1132@gmail.com'
if (admin == email){

Order.find()
  .then(orders => {
    // orders.sort();
    orders.reverse();
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));

  

}else{


  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      // orders.sort();
      orders.reverse();
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
}};

