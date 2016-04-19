var toobusy = require('toobusy-js');
var mods = require('./getProps.js');
var app = mods.app;

app.use(function(req, res, next) {
	if (toobusy()) {
		res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	} else {
		next();
	}
});

var file_reg = require('./register.js');
var file_CreateServ = require('./create-server.js');
var file_login = require('./login.js');
var cp_serv = require('./controlpanel-server.js');