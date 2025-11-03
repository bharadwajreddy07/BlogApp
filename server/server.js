const exp=require("express");
const mongoose=require("mongoose");
const app=exp();
require("dotenv").config();
const PORT=process.env.PORT || 4000;
//import apis
const authorApi=require("./APIs/authorApi");
const userApi=require("./APIs/userApi");
const adminApi=require("./APIs/adminApi");
const cors=require("cors");

// CORS configuration for deployment
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://blogapp-seven-beta.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(exp.json());

//db connection
mongoose.connect(process.env.DBURL)
.then(
    ()=>{
        app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
        console.log("DB connected");
    }
)
.catch(err=>console.log("DB connection error",err));

// Root route for health check
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'BlogApp API is running',
        status: 'OK',
        endpoints: {
            users: '/userApi',
            authors: '/authorApi',
            admin: '/adminApi'
        }
    });
});

// Mount routers
app.use('/userApi', userApi);
app.use('/authorApi', authorApi);
app.use('/adminApi', adminApi);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.url 
    });
});

//error handling
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    
    res.send({message:err.message})
})

// Export for serverless platforms
module.exports = app;