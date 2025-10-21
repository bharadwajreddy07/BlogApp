const UserAuthor = require('../models/userauthor');

async function createUserOrAuthor(req, res, next) {
    try{
        const newUserAuthor = req.body;
        const userinDB = await UserAuthor.findOne({email: newUserAuthor.email });
        if (userinDB!==null) {
            if(newUserAuthor.role!==userinDB.role){
                // Update user's role in database
                userinDB.role = newUserAuthor.role;
                const updatedUser = await userinDB.save();
                res.status(200).send({message:newUserAuthor.role,payload:updatedUser});
            }
            else{
                // User already has this role, just return success
                res.status(200).send({message:newUserAuthor.role,payload:userinDB});
            }
        }
        else {
           let newuser=new UserAuthor(newUserAuthor);
             let newuserAuthorDoc = await newuser.save();
                res.status(201).send({message:newuserAuthorDoc.role,payload:newuserAuthorDoc});
        }
    } 
    catch (error) {
        next(error);
    }
}

module.exports = createUserOrAuthor;