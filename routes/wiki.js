const nunjucks = require('nunjucks');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

// body-parser boilerplate, can also go in app.js
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
	// retrieve all wiki pages
	User.findOrCreate({
		where: {
			name: req.body.name,
			email: req.body.email
		}
	}).then(function(values) {
		var user = values[0];

	var page = Page.build({
		title: req.body.title,
		content: req.body.content
	});

	return page.save().then(function(page) {
		return page.setAuthor(user);
	});
	})
	.then(function(page) {
		res.redirect(page.route);
	})
	.catch(next);

// 	Page.findAll({
// 		attributes: ['title', 'urlTitle']
// 	}).then(function(foundPages) {
// 		res.render('index', { pages: foundPages });
// 	}).catch(next);
// });

// router.post('/', function(req, res, next) {
// 	// submit a new page to the database
// 	var page = Page.build({
// 		title: req.body.title,
// 		content: req.body.content,
// 	});

// 	page.save().then(function(savedPage, author) {
// 		res.render('wikipage', { page: savedPage, user: author });
// 		// res.redirect(savedPage.route); // virtual route
// 	}).catch(function(err) {
// 		console.error(err);
// 	});
});

router.get('/add', function(req, res, next) {
	// retrieve the "add a page" form
	res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(function(foundPage) {
		res.render('wikipage', { page: foundPage });
	}).catch(next);
});
