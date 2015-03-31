var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/dashboard', function(req, res) {
  //res.sendFile(path.normalize(__dirname+'/../public/admin-panel.html'));
});

module.exports = router;
