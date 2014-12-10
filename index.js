/**
 * Launcher del servidor.
 *
 * @author David Soler <aensoler@gmail.com>
 */

const SERVER_HOST = "127.0.0.1",
      SERVER_PATH = "",
      SERVER_PORT = 2000;

var express    = require("express"),
    restServer = express(),
    bodyParser = require('body-parser'),
    fs         = require("fs");

var PersistenceFacade = require("./db/PersistenceFacade.class.js"),
    pf = new PersistenceFacade();

pf.createTables(function() {
	console.log("Database OK");
});

// Creates application/json parser
var jsonParser = bodyParser.json();

var makeResponse = function(status, content) {
	return JSON.stringify({status: status, content: content});
};

restServer.post(SERVER_PATH+"/users", jsonParser, function(req, res) {
	var requestJson = req.body;

	if (typeof requestJson["name"] !== "string") {
		res.end(makeResponse(false, "Name have to be a string"));
	} else {
		pf.createUser(requestJson["name"], function(err) {
			if (err) {
				res.end(makeResponse(false, err));
			} else {
				res.end(makeResponse(true, "OK"));
			}
		});
	}
});

restServer.get(SERVER_PATH+"/users", function(req, res) {
	pf.getUsers(function(err,rows) {
		if (err) {
			res.end(makeResponse(false, err));
		} else {
			res.end(makeResponse(true, rows));
		}
	});
});

restServer.post(SERVER_PATH+"/quotes", jsonParser, function(req, res) {
	var requestJson    = req.body,
	    inputIsInvalid = false;

	if (typeof requestJson["from"] !== "string")
		inputIsInvalid = "From have to be a string";

	if (typeof requestJson["text"] !== "string")
		inputIsInvalid = "Text have to be a string";

	if (typeof requestJson["to"] !== "string")
		inputIsInvalid = "To have to be a string";

	if (inputIsInvalid) {
		res.end(makeResponse(false, inputIsInvalid));
	} else {
		pf.createQuote(requestJson["from"],requestJson["to"],requestJson["text"], function(err) {
			if (err) {
				res.end(makeResponse(false, err));
			} else {
				res.end(makeResponse(true, "OK"));
			}
		});
	}
});

restServer.get(SERVER_PATH+"/quotes/:username", function(req, res) {
	var username = req.params.username;
	console.log("Fetching all quotes of the " + username + "'s book.");
	pf.getQuotesToUser(username, function(err,rows) {
		if (err) {
			res.end(makeResponse(false, err));
		} else {
			res.end(makeResponse(true, rows));
		}
	});
});

restServer.listen(SERVER_PORT, function() {
	console.log("Listening on *: " + SERVER_PORT);
});
