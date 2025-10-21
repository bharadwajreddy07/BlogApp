
import {createContext,useState} from "react";

// Create and export the context object
export const UserAuthorContextObj=createContext();

function UserAuthorContext({children}) {
 let [currentUser,setCurrentUser]=useState({
    firstname:"",
    lastname:"",
    email:"",
    profileimageURL:"",
    role:"",
 });
return (
  <UserAuthorContextObj.Provider value={{currentUser,setCurrentUser}}>
    {children}
  </UserAuthorContextObj.Provider>
);
}
export default UserAuthorContext;