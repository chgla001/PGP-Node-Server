const express = require('express');

const database = require('../Database');

const router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.send('Birds home page')
});

router.post('/example', function (req, res) {
    console.log(req.body);
    res.json(req.body);
});

router.post('/userdata', function (req, res) {
    console.log(req.body);
    const data = req.body;
    // console.log("username", data.name);
    // console.log("email", data.email);
    // console.log("password", data.password);
    //console.log("pgpkey", data.pgpkey);

    database.createUser(data).then(function () {
        console.log("user created");
        database.getUserByName(data.name).then(function(data){
            res.json(data)
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function (err) {
        console.log(err);
    })
});

router.get('/allusers', function (req, res) {
    console.log('all users');

    database.getAllUsers().then(function (data) {
        console.log('all users', data);
        res.json(data);
    });
});

router.get('/user', function (req, res) {
    console.log('all usernames Method');

    database.getUser().then(function (data) {
        console.log('all usernames and ids', data);
        res.json(data);
    });
});

router.get('/userById', function (req, res) {
    console.log('get user by id Method');
    var userId = req.param('id');

    database.getUserById(userId).then(function (data) {
        console.log('userdata', data);
        res.json(data);
    });
});


// // define the about route
// router.get('/about', function (req, res) {
//     res.send('About birds')
// })

module.exports = router;