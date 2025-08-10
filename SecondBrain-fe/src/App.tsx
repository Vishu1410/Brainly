// import Dashboard from "./pages/Dashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom"


import Dashboard from "./pages/Dashboard"
import { Toaster } from "react-hot-toast"
import LoginPage from "./pages/Login-page"
import SignupPage from "./pages/Signup-page"
import Sharedview from "./pages/Sharedview"
import { UserProvider } from "./Context/UserContext"
import ViewSharedBrain from "./pages/ViewSharedBrain"
import  ProtectedRoute  from "./Component/ProtectedRoute"


const App = ()=>{
  return <UserProvider> 
    <BrowserRouter>
        <Toaster/>
          <Routes>

            
            <Route path="/signup" element = {<SignupPage/>}/>
            <Route path="/login" element = {<LoginPage/>}/>
            <Route path="/dashboard" element = {
                    
                  <ProtectedRoute>
                      <Dashboard/>
                  </ProtectedRoute>
              
              }/>
            <Route path="/shared/:shareToken" element = {<Sharedview/>}/>
            <Route path="/sharebrain/:brainToken" element = {<ViewSharedBrain/>}/>


            
          </Routes>
   
      

    </BrowserRouter>
  </UserProvider>
}


export default App