const express = require('express')
const app = express();
const nunjucks = require('nunjucks');
const routes = require('./routes');
const models = require('./models');
const wikiRouter = require('./routes/wiki.js');
const bodyParser = require('body-parser');

var env = nunjucks.configure('views', { noCache: true });

app.set('view engine', 'html');

app.engine('html', nunjucks.render);

app.use(express.static('public'));
app.use('/wiki', wikiRouter);

models.User.sync({ force: true }) // { force: true }
	.then(function() {
		return models.Page.sync({ force: true }); //{ force: true }
	})
	.then(function() {
		app.listen(3000, function() {
		console.log('server connected');
		});
	})
	.catch(console.error);
