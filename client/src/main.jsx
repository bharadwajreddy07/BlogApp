import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,Navigate,RouterProvider} from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import Rootlayout from './Components/user/Rootlayout.jsx';
import Home from './Components/common/Home.jsx';
import Signup from './Components/common/Signup.jsx';
import Signin from './Components/common/Signin.jsx';
import Header from './Components/common/Header.jsx';
import Footer from './Components/common/Footer.jsx';
import Articlebyid from './Components/common/Articlebyid.jsx';
import UserProfile from './Components/user/UserProfile.jsx';
import AuthorProfile from './Components/author/AuthorProfile.jsx';
import Postarticle from './Components/author/Postarticle.jsx';
import EditArticle from './Components/author/EditArticle.jsx';
import Articles from './Components/common/Articles.jsx';
import UserAuthorContext from './Components/Context/UserAuthorContext.jsx';
import { ThemeProvider } from './Components/Context/ThemeContext.jsx';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const createbrowseobj=createBrowserRouter([
  {
  path: "/",
  element: <Rootlayout />,
  children: [{
    path: "",
    element: <Home />,
},
{
  path: "/signup",
  element: <Signup />,
},
{
  path: "/signin",
  element: <Signin />,
},
{
  path: "/articles",
  element: <Articles />,
},
{
  path: "/article/:articleId",
  element: <Articlebyid />,
},
{
  path: "/user-profile",
  element: <UserProfile />,
},
{
  path: "/author-profile",
  element: <AuthorProfile />,
},
{
  path: "/post-article",
  element: <Postarticle />,
},
{
  path: "/edit-article/:articleId",
  element: <EditArticle />,
}
]
}
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <UserAuthorContext>
          <RouterProvider router={createbrowseobj} />
        </UserAuthorContext>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
)
