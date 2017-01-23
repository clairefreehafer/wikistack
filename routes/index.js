const nunjucks = require('nunjucks');
const express = require('express');
const router = express.Router();

router.get('/', function(res, req) {
	res.render('index', function(err, data) {
		if (err) console.error(err);
	});
});


