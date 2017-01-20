const express = require('express')
const app = express();
const nunjucks = require('nunjucks');
const routes = require('./routes');
const models = require('./models');

var env = nunjucks.configure('views', { noCache: true });

app.set('view engine', 'html');

app.engine('html', nunjucks.render);

app.listen(3000, function() {
	console.log('server connected');
});

models.User.sync({})
	.then(function() {
		return models.Page.sync({});
	})
	.then(function() {
		console.log('Server is listening on port 3001!');
	})
	.catch(console.error);

app.use(express.static('public'));
