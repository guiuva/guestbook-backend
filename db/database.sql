-- +----------------------------------------------+
-- | Guestbook                                    |
-- +----------------------------------------------+
-- | Version  : 1.0                               |
-- | Language : Standard SQL                      |
-- | Date     : Wed Dec 10 2014                   |
-- | Schema   : guestbook/1.0                     |
-- | Authors  : David Soler <aensoler@gmail.com>  |
-- +----------------------------------------------+


-- Database Section
-- ________________ 

--create database guestbook;
-- ## REPLACE "main" to "guestbook" for no SQLite database.

-- Tables Section
-- _____________
DROP TABLE IF EXISTS main.quotes;
DROP TABLE IF EXISTS main.users;

CREATE TABLE main.users (
	username VARCHAR(100) CONSTRAINT users_nn NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (username)
);

CREATE TABLE main.quotes (
	id        INTEGER PRIMARY KEY,
	text      TEXT,
	time      TIMESTAMP,
	from_user VARCHAR(100) CONSTRAINT quotes_from_user_nn NOT NULL,
	to_user   VARCHAR(100) CONSTRAINT quotes_to_user_nn   NOT NULL,

	FOREIGN KEY (from_user) REFERENCES users(username),
	FOREIGN KEY (to_user)   REFERENCES users(username)
);

-- Enables foreign key support
PRAGMA foreign_keys = ON;
