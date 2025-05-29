// import Dashboard from "./pages/Dashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import { Toaster } from "react-hot-toast"

const App = ()=>{
  return <BrowserRouter>
    <Toaster/>
      <Routes>
       <Route path="/signup" element = {<Signup/>}/>
       <Route path="/login" element = {<Login/>}/>
       <Route path="/dashboard" element = {<Dashboard/>}/>

        
      </Routes>

  </BrowserRouter>
}


export default App