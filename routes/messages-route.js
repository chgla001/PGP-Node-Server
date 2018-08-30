const express = require('express');
const database = require('../Database');

const router = express.Router();

router.post('/new-message', function (req, res) {
    const data = req.body;
    database.createMessage(data).then(function () {
        res.json(201);
    })
});

router.get('/getMessages', function (req, res) {
    var userid = req.param('senderid');
    var chatpartnerid = req.param('recipientid');
    database.getMessages(userid, chatpartnerid).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        console.log('getMessages catch: err', err)
        res.json("");
    });
});

router.post('/updateMessage', function (req, res) {
    const messageId = req.body.id;
    database.updateMessage(messageId).then(function () {
        res.json('');
    }).catch(function (err) {
        console.log('updateMessage catch: err', err)
        res.json("");
    });
});

module.exports = router;