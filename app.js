var express = require("express");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
//mongoose.connect("mongodb://localhost/restful");
mongoose.connect("mongodb://shreynik:shreynik@ds123312.mlab.com:23312/yelpcamp")

var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String, 
	created: {type:Date ,default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);
app.use(bodyParser.urlencoded({extended:true}));
//This line should come after body-parser
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

// Blog.create({
// 	title: "My First Blog",
// 	image: "http://photosforclass.com/download/4369518024",
// 	body: "This is a nice place to visit!!!"
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});


//NEW ROUTE

app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE

app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
			res.render("new");
		else
			res.redirect("/blogs");

	});

});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
			console.log("error");
		else
		{
			res.render("index",{blogs: blogs});
		}
	});
});


//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			res.send("errors");
		else
		{
			res.render("show",{blog:foundBlog});
		}

	});

});

//EDIT-ROUTE

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			res.redirect("/blogs");
		else
		{
			res.render("edit",{blog: foundBlog});
		}

	});

});

//UPDATE ROUTE

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);

		}

	});

});

//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.send("Not Able to Update");
		else
			res.redirect("/blogs");

	});

});


app.listen(process.env.PORT,process.env.IP,function(req,res){
	console.log("server has started");
});


// app.listen(3000,function(req,res){
// 	console.log("server has started");
// });