const mongoose=require("mongoose");
const authorSchema=new mongoose.Schema({
    nameOfAuthor:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        required:true
    }
},{strict:"throw"});
//comment schema
const commentSchema=new mongoose.Schema({
    nameofUser:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{strict:"throw"});
//article schema
const articleSchema=new mongoose.Schema({
  authorData:{
    type:authorSchema,
    required:true},
    articleId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    dateOfCreation:{
        type:String,
        required:true
    },
    dateOfModification:{
        type:String,
       required:true
    },
    comments:{
        type:[commentSchema],
        default:[]
    },
    isArticleActive:{
        type:Boolean,
        default:true
    }
});
//model
const articlem=mongoose.model("Article",articleSchema);
module.exports=articlem;