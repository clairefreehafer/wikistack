const nunjucks = require('nunjucks');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../models');
const Page = models.Page;
const User = models.User;
const bluebird = require('bluebird');

module.exports = router;

// body-parser boilerplate, can also go in app.js
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
	// retrieve all wiki pages
	Page.findAll({
		attributes: ['title', 'urlTitle']
	}).then(function(foundPages) {
		res.render('index', { pages: foundPages });
	}).catch(next);
});

router.get('/users', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/users/:id', function(req, res, next) {
	var pageLookUp =  Page.findAll({
		where: {
			authorId: req.params.id
		}
	})
	var userLookUp = User.findById(req.params.id);

	var arr = [pageLookUp, userLookUp];
	bluebird.all(arr).then(function(newArr) {
		console.log(newArr[0].dataValues);
		res.render('user_page', { pages: newArr[0], user: newArr[1] })
	}).catch(next);

	// Page.findAll({
	// 	where: {
	// 		authorId: req.params.id
	// 	}
	// }).then(function(users) {

	// })
})

router.post('/', function(req, res, next) {
	// submit a new page to the database
	User.findOrCreate({
		where: {
			name: req.body.name,
			email: req.body.email
		}
	})
	.then(function (values) {

		var user = values[0];

		var page = Page.build({
			title: req.body.title,
			content: req.body.content,
			tags: req.body.tags
		});

		return page.save().then(function (page) {
			return page.setAuthor(user);
		});

	})
	.then(function (page) {
		res.redirect('/wiki/');
	})
	.catch(next);
});

router.get('/add', function(req, res, next) {
	// retrieve the "add a page" form
	res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		},
		include: [
			{ model: User, as: 'author' }
		]
	})
	.then(function(page) {
		if (page === null) {
			res.status(404).send();
		} else {
			res.render('wikipage', { page: page });
		}
	}).catch(next);
});
