const express = require('express');
var path = require('path');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/get_data', function(req, res) {
    Sensor.find(function(err, sensors) {
        if (err) return console.error(err);
        //console.log("existing todos are: ", todos);
        // render index page, passing todos as local variable
        console.log(sensors[1])
        res.send(sensors);
        //res.render('index', {
          //  todos: todos
       //});
    });
})

router.get('/sensors', function(req, res, next) {
    return res.sendFile(path.join(__dirname + '/../views/index.html'));
});
module.exports = router;
