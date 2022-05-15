CREATE TABLE IF NOT EXISTS "comments" (
	"text"	TEXT NOT NULL UNIQUE,
	"created_at"	TEXT,
	"id"	INTEGER NOT NULL UNIQUE,
  "user_id" INTEGER NOT NULL,
  "meme_id" INTEGER NOT NULL,
  "likes" INTEGER,
  "deslikes" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
  FOREIGN KEY("user_id") REFERENCES "accounts"("id"),
  FOREIGN KEY("meme_id") REFERENCES "memes"("id")
);