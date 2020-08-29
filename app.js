var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer=require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app 	       = express();


mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method")); //for using routes such as PUT and DELETE

var blogSchema   = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Test blogs",
// 	image:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-		1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
// 	body:"It is just a testing element dont bother in so much"
	
// },function(err,blog){
// 	if(err)
// 	{
// 		console.log(err)
// 	}
// 	else{
// 		console.log("saved");
// 		console.log(blog);
// 	}
// });

app.get("/",function(req,res){
	
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	
	Blog.find({},function(err,blogs){
		if(err)
			{
				console.log("OOps Error ocurred!");
			}
		else
			{
				res.render("index",{blogs:blogs});
			}
	});
});

//new
app.get("/blogs/new",function(req,res){
	
	res.render("new");
});

//create

app.post("/blogs",function(req,res){
	console.log(req.body);
	req.body.blogs.body = req.sanitize(req.body.blogs.body);
	console.log(req.body);
	
	Blog.create(req.body.blogs,function(err,newblog){
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("/blogs");
		}
	});
});

//show
app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id,function(err,foundBLog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.render("show",{blog:foundBLog});
			}
	});
	
});

//edit
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id,function(err,foundBLog){
		if(err)
			{
				res.redirect("/blogs/:id");
			}
		else
			{
				res.render("edit",{blog :foundBLog});
			}
	});
});

//update
app.put("/blogs/:id",function(req,res){
	console.log(req.body);
	req.body.blogs.body = req.sanitize(req.body.blogs.body);
	console.log(req.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updated){
		if(err)
			{
				res.redirect("/blogs/:id");
			}
		
		else
			{
				res.redirect("/blogs/"+ req.params.id);
			}
	});
});

//delete

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			{
				res.redirect("/blogs");
			}
		
		else{
			res.redirect("/blogs");
		}
	});
});



app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server has started!!");
});
	




