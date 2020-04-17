//Importing all required packages
var express= require("express")
var app=express()
var mongoose=require("mongoose")
var bodyparser=require("body-parser")
var override=require("method-override")
var expressSanitizer=require("express-sanitizer")
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(override("method"))
app.use(expressSanitizer())

// set view engine to ejs
app.set("view engine","ejs")

// Connecting mongoose to database
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})

// Creating mongoose schema
var blogSchema=new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    created: {type:Date,default:Date.now}
})

//Making model using collection variable and schema
var blog=mongoose.model("blog",blogSchema)

//main route
app.get("/",function(req,res){
    res.redirect("/blogs")
})

//blogs route
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err)
        }else{
            res.render("index",{blogs:blogs})
        }
    })
    
})

//Route to create new blog post
app.get("/blogs/new",function(req,res){
    res.render("new")
})


// Post request from form to date data in database
app.post("/blogs",function(req,res){
    req.body.blog.desc=req.sanitize(req.body.blog.desc)
    blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs")
        }
    })
})

//This is the route to find more about blog
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,blogData){
        if(err){
Console.log(err)
        }else{
            res.render("home",{blog:blogData})
        }
    })
})

//This is the route to edit the blog
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,blogData){
        if(err){
            console.log(err)
        }else{
            res.render("edit",{blog:blogData})
        }
    })
})

//Route to update data in database
app.put("/blogs/:id",function(req,res){
    req.body.blog.desc=req.sanitize(req.body.blog.desc)
    
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blogData){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

//Route  to delete data in database
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs")
        }
    })
})

// To connect nodejs connect to localhost at port 3000
app.listen(3000,"127.0.0.1",function(){
    console.log("Blog sever has started")
})

