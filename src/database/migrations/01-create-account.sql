CREATE TABLE IF NOT EXISTS "accounts" (
	"firstName"	TEXT,
	"lastName"	TEXT,
  "bio"	TEXT,
  "avatar_url"	TEXT,
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);