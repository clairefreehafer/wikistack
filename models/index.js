var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
				allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
				allowNull: false,

				route: function(value) {

				}
    },
    content: {
        type: Sequelize.TEXT,
				allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
				allowNull: false
    },
    email: {
        type: Sequelize.STRING,
				isEmail: true,
				allowNull: false
    }
});

module.exports = {
  Page: Page,
  User: User
};