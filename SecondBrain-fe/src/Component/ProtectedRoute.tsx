import { ReactNode } from "react";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({ children } : {children : ReactNode}) => {

  const brainToken = localStorage.getItem("brainToken");

  if(!brainToken){
    return <Navigate to= "/login" replace/>
  }
  return <>{ children }</>
}

export default ProtectedRoute
