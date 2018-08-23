const express = require('express');

const database = require('../Database');

const router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.send('messages')
});

router.post('/new-message', function (req, res) {
    const data = req.body;
    database.createMessage(data).then(function () {
        console.log("message created");
        database.getLastMessageFromSenderById(data.senderid).then(function (row) {
            res.json(row);
        })
    })
});

router.get('/getMessages', function (req, res) {
    console.log('getMessages');

    var userid = req.param('senderid');
    var chatpartnerid = req.param('recipientid');  

    database.getMessages(userid, chatpartnerid).then(function (data) {
        console.log('getMessages succes:', data);
        res.json(data);
    }).catch(function (err) {
        console.log('getMessages catch: err',err)
        res.json("");
    });
});

module.exports = router;