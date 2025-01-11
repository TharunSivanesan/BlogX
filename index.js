import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app=express();
const port=3000;
const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"blogx",
    password:"Tharun03",
    port:"5433"
});
db.connect();

async function getBlogs(){
    const data=await db.query("select * from blogs order by id;");
    console.log(data.rows);
    return data.rows;
}
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const blogs = await getBlogs();

app.get("/",async (req,res)=>{
    const blogs = await getBlogs();
    const response=await axios.get("https://bible-api.com/data/web/random");
    const result=response.data.random_verse;
    console.log(result);
    res.render("index.ejs",{chapter:result.chapter,verse:result.verse,text:result.text});
});
app.get("/blogs",async (req,res)=>{
    const blogs = await getBlogs();
    res.render("blogs.ejs",{data:blogs});
});
app.get("/create",(req,res)=>{
    res.render("create.ejs");
});

app.get("/blog:id",(req,res)=>{
    const blog=blogs.find((item)=>item.id==req.params.id);
    console.log(blog);
    res.render("blog.ejs",{data:blog});
})

app.post("/submit",async(req,res)=>{
    await db.query("insert into blogs(title,text) values ($1,$2);",[req.body.title,req.body.text]);
    res.redirect("/blogs");
});

app.post("/edit",async(req,res)=>{
    var id=req.body.edit;
    var title=req.body.title;
    var text=req.body.text;
    await db.query("update blogs set title=$1,text=$2 where id=$3;",[title,text,id]);
    res.redirect("/blogs");
});

app.post("/action", async (req, res) => {
    if(req.body.delete){
        var id=req.body.delete;
        await db.query("delete from blogs where id=$1",[id]);
        res.redirect("/blogs");
    }
    else{
        var id=parseInt(req.body.edit);
        const blog=blogs.find(blog=>blog.id==id);
        console.log(blog);
        res.render("edit.ejs",{blog:blog});
    }
});

  
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});