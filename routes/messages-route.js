const express = require('express');

const database = require('../Database');

const router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.send('messages')
});

router.post('/new-message', function (req, res) {
    console.log(req.body);
    res.json(req.body);
});

// router.post('/userdata', function (req, res) {
//     console.log(req.body);
//     const data = req.body;
//     database.createUser(data).then(function () {
//         res.statusCode = 201;
//     })
// });

// router.get('/allusers', function (req, res) {
//     database.getAllUsers().then(function (data) {
//         res.json(data);
//     });
// });

// // define the about route
// router.get('/about', function (req, res) {
//     res.send('About birds')
// })

module.exports = router;