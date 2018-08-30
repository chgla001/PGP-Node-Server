const express = require('express');
const database = require('../Database');

const router = express.Router();

router.post('/userdata', function (req, res) {
    const data = req.body;
    database.createUser(data).then(function () {
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
    database.getAllUsers().then(function (data) {
        res.json(data);
    });
});

router.get('/user', function (req, res) {
    database.getUser().then(function (data) {
        res.json(data);
    });
});

router.get('/userById', function (req, res) {
    var userId = req.param('id');
    database.getUserById(userId).then(function (data) {
        res.json(data);
    });
});

module.exports = router;