const path = require('path');
const order = require('./models/order')
const db = require('db')
const multer = require('multer');
var fs = require('fs');
const Sensor = require('./models/sensor')
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb://localhost:27017/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.use(bodyParser.urlencoded({
  extended: false
}));

//-------------------------------
app.get('/todoss', function(req, res) {
  order.find(function(err, orders) {
      if (err) return console.error(err);
      //console.log("existing todos are: ", todos);
      // render index page, passing todos as local variable
     // console.log(sensors[1])
      res.send(orders);
      //res.render('index', {
        //  todos: todos
     //});
  });
})
app.get('/display', function(req, res, next) {
  return res.sendFile(path.join(__dirname + '/views/index.html'));
});


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//------------------
var mqtt = require('mqtt');
var options = {
    port: 16445,
    host: 'mqtt://hairdresser.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'arjmjjfy',
    password: '34S9fTK035LO',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var client = mqtt.connect('mqtt:hairdresser.cloudmqtt.com', options);
client.on('connect', function() { // When connected
    console.log('connected');
    //subscribe to a topic
    client.subscribe('test/#', function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
          var x = message.toString();
          var y = JSON.parse(x)
          console.log(y)
          const sensor = new Sensor({
            value : y
          });
          sensor
            .save()
            .then(result => {
                // console.log(result);
            })
            .catch(err => {
              console.log(err);
           });
        });
  
    });

    //publish a message to a topic
    // setInterval(function(){client.publish('test', 'Hello mqtt')},1000)
});
//-----------------


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000, '0.0.0.0');
  })
  .catch(err => {
    console.log(err);
  });


