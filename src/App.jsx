import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Auth/Login.jsx"
import SignUp from "./pages/Auth/Signup.jsx"
import Home from "./pages/Home/Home.jsx"


const App = () => {
  return (
    <div>
       <Router>
        <Routes>
        <Route path="/" element={<Root />} /> 
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<SignUp/>} /> 
        </Routes>
       </Router>
    </div>
  )
}

//Define the Root component to handle the intial redirect

const Root=()=>{
  //check if token exsistes in localstorage

  const isAuthenticated=!!localStorage.getItem("token");

  //Redirect to dashboard if authenticated otherwise to login

  return isAuthenticated ?(<Navigate to="/dashboard"/>):(<Navigate to="/login"/>)
}

export default App
