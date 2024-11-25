-- insertion queries

db.books.insertOne({
	title: "The Hobbit",
	author: "J.R.R Tolkien",
	genre: "fantasy",
	publishedYear: 1937
})

db.books.insertMany([
	{
		title: "To Kill a Mockingbird",
		author: "Harper Lee",
		genre: "fiction",
		publishedYear: 1960
	}, {
		title: "1984",
		author: "George Orwell",
		genre: "Dystopian",
		publishedYear: 1949
	}
])



-- retrieve queries
db.books.find({}, {title: 1, _id:0});

db.books.find(
		{ author: "J.R.R Tolkien", }
);

-- update query
db.books.updateOne(
	{ title: "1984",},
	{ $set:{
		genre: "science fiction"
	}}
)

-- delete query
db.books.deleteOne({
	title: "The Hobbit"
})
