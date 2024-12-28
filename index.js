import express from "express";
import bodyParser from "body-parser";

const app=express();
const port=3000;

const blogs = [
    {
        title: "The Importance of Morning Routines",
        blogcontent: "Starting your day with a structured morning routine can improve productivity and mental clarity. A simple morning routine can include waking up early, meditating, having a nutritious breakfast, and setting goals for the day. These practices can set a positive tone for the rest of your day."
    },
    {
        title: "Top 5 JavaScript Frameworks in 2024",
        blogcontent: "The JavaScript ecosystem is constantly evolving. In 2024, some of the top frameworks include React, Vue.js, Angular, Svelte, and Next.js. Each of these frameworks offers unique features for building modern web applications, such as server-side rendering, state management, and efficient component-based architectures."
    },
    {
        title: "Exploring the World of Artificial Intelligence",
        blogcontent: "Artificial Intelligence (AI) is transforming various industries, from healthcare to finance. Machine learning, a subset of AI, enables systems to learn from data and improve over time. Recent advancements in AI have led to innovations like chatbots, personalized recommendations, and autonomous vehicles."
    },
    {
        title: "How to Stay Motivated While Working from Home",
        blogcontent: "Working from home has its challenges, including staying motivated and focused. To overcome these, establish a dedicated workspace, set a daily schedule, and take regular breaks to recharge. Staying connected with colleagues and setting boundaries between work and personal life can also help maintain a healthy balance."
    },
    {
        title: "The Benefits of Reading Fiction",
        blogcontent: "Reading fiction offers more than just entertainment; it enhances empathy, creativity, and cognitive function. Studies show that people who read fiction regularly can better understand others' emotions and viewpoints. Moreover, fiction stimulates the imagination and encourages deeper thought processes."
    }
];

console.log(blogs);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/blogs",(req,res)=>{
    res.locals.data=blogs;
    res.render("blogs.ejs");
});
app.get("/create",(req,res)=>{
    res.render("create.ejs");
});

for (let index = 0; index < blogs.length; index++) {
    app.get("/blog"+index,(req,res)=>{
        res.locals.data=blogs[index];
        res.render("blog.ejs");
    })
}

app.post("/submit",(req,res)=>{
    blogs.push({
        title:req.body["title"],
        blogcontent:req.body["blogcontent"]
    });
    console.log(req.body["title"],req.body["blogcontent"]);
    console.log(blogs);
    res.locals.data=blogs;
    res.redirect("/blogs");
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    if (id >= 0 && id < blogs.length) {
        blogs.splice(id, 1); // Remove the blog at the given index
        console.log(`Blog with ID ${id} deleted`);
        res.status(200).send("Blog deleted successfully");
    } else {
        res.status(404).send("Blog not found");
    }
});
  
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});