var express = require('express');
var router = express.Router();


router.post('/data', function(req, res, next) {
    res.render('result', { title: 'Круги Гаджиева', moreDatas: req.body.tasks.reverse() });
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Круги Гаджиева' });
});


module.exports = router;
