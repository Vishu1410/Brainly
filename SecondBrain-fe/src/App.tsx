// import Dashboard from "./pages/Dashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom"


import Dashboard from "./pages/Dashboard"
import { Toaster } from "react-hot-toast"
import LoginPage from "./pages/Login-page"
import SignupPage from "./pages/Signup-page"
import Sharedview from "./pages/Sharedview"


const App = ()=>{
  return <BrowserRouter>
    
      <Toaster/>
        <Routes>
        <Route path="/signup" element = {<SignupPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route path="/dashboard" element = {<Dashboard/>}/>
        <Route path="/shared/:shareToken" element = {<Sharedview/>}/>

          
        </Routes>
      

  </BrowserRouter>
}


export default App