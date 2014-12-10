/**
 * Clase que abstrae la persistencia mediante el patrón fachada.
 *
 * @class PersistenceFacade
 *
 * @author David Soler <aensoler@gmail.com>
 */
var PersistenceFacade = function() {
	/**
	 * @private
	 */
	this._SQL_FILE = "./db/database.sql";

	this.PersistenceFacade.apply(this, arguments);
};

PersistenceFacade.prototype = {
	/**
	 * @constructor
	 * @public
	 */
	PersistenceFacade : function() {
		this._sqlite3 = require("sqlite3").verbose();
		this._db      = new this._sqlite3.Database("./db/sqlite.db");
	},

	/**
	 * @private
	 */
	_checkCallback : function(callback) {
		return (typeof callback !== "function" ? function(){} : callback);
	},

	/**
	 * @public
	 */
	createTables : function(callback) {
		var db = this._db,
		    me = this,
		    fs = require("fs");

		callback = this._checkCallback(callback);

		console.info("Reading SQL file in order to create the tables.");
		fs.readFile(me._SQL_FILE, 'utf8', function (err, data) {
			if (err) {
				console.log(err);
			} else {
				db.serialize(function() {
					db.exec(data);
					callback();
				});
			}
		});
	},

	/**
	 * @public
	 */
	createUser : function(username, callback) {
		callback = this._checkCallback(callback);
		this._db.run("INSERT INTO users VALUES(?)", username, function(err) {
			callback(err);
		});
	},

	/**
	 * @public
	 */
	getUsers : function(callback) {
		callback = this._checkCallback(callback);
		this._db.all("SELECT * FROM users", function(err, rows) {
			callback(err, rows);
		});
	},

	/**
	 * @public
	 */
	createQuote : function(from, to, text, callback) {
		callback = this._checkCallback(callback);
		this._db.run("INSERT INTO quotes VALUES(null,?,null,?,?)", text, from, to, function(err) {
			callback(err);
		});
	},

	/**
	 * @public
	 */
	getQuotesToUser : function(username, callback) {
		callback = this._checkCallback(callback);
		this._db.all("SELECT * FROM quotes WHERE to_user=?", username, function(err,rows) {
			callback(err, rows);
		});
	},

	/**
	 * @public
	 */
	closeDB : function(callback) {
		callback = this._checkCallback(callback);
		this._db.close(function(err) {
			callback(err);
		});
	}
};

module.exports = PersistenceFacade;