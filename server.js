const express = require('express');
const app=express();
app.use(express.json());
const cors = require('cors')
const path=require('path');
const corsOptions = {
            origin: ['http://localhost:5000', 'https://www.wikipedia.org/'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'], 
            allowedHeaders: ['Content-Type', 'Authorization'], 
            credentials: true 
};
app.use(cors(corsOptions));


const cookieParser = require("cookie-parser");
app.use(cookieParser());

const dashboardRoutes = require("./routes/dashboard.route");
app.use("/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.render("home");
});



const dotenv=require("dotenv");
dotenv.config();

app.use(express.urlencoded({ extended: true })); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// const pageRoutes = require('./routes/page.routes');
// app.use('/', pageRoutes); 


// app.get('/',(req,res)=>{
//     res.render("home",{req});
// })
const googleRoutes = require("./routes/google.routes");
app.use("/", googleRoutes); 

const authRoute=require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes");
const commentRoute = require("./routes/comment.routes");

const rateLimiterMiddleware= require("./middlewares/rateLimiterMiddleware");

app.use("/api/auth",rateLimiterMiddleware,authRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoute);


const connection=require("./models/db");
connection.connect(err=>{
    if(err)
    {
        console.log("error in Connecting to database")
    }
    else{
        console.log("connected to database mysql")
    }
});

const PORT=process.env.PORT||5000;
// app.get("/",(req,res)=>{
//     res.send("blog app with mysql is running fine")
// });




app.listen(PORT ,()=>{
    console.log(` Server is running at: http://localhost:${PORT}`);
})

