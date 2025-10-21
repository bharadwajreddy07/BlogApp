const exp=require("express");
const mongoose=require("mongoose");
const app=exp();
require("dotenv").config();
const PORT=process.env.PORT;
//import apis
const authorApi=require("./APIs/authorApi");
const userApi=require("./APIs/userApi");
const adminApi=require("./APIs/adminApi");
const cors=require("cors");
app.use(cors());
//db connection
mongoose.connect(process.env.DBURL)
.then(
    ()=>{
        app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
        console.log("DB connected");
    }
)
.catch(err=>console.log("DB connection error",err));
app.use(exp.json());
// Mount routers
app.use('/userApi', userApi);
app.use('/authorApi', authorApi);
app.use('/adminApi', adminApi);
//error handling
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    
    res.send({message:err.message})
})