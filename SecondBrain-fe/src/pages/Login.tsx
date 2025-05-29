import { Button } from "../Component/Button";

import { InputField } from "../Component/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


export const Login = ()=>{

    const usernameaRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    const navigate = useNavigate();
    async function login(){
        try{
            const username = usernameaRef.current?.value;
            const password = passwordRef.current?.value;
            // const confirmpassword =  confirmpasswordRef.current?.value
            const response = await axios.post(BACKEND_URL+"/api/v1/login",{
                
                    username,
                    password
                
            })
            const jwt = response.data.Authorization;
            
            localStorage.setItem("token",jwt)
            alert("you are login...");
            navigate("/dashboard");


        }catch(error){
            console.log(error);
            alert("error occur");
        }
        

    }



    return <div className="h-screen w-screen bg-red-300 flex justify-center items-center ">

        <div className="w-72 h-72 rounded-xl bg-white flex flex-col p-4 gap-2">
            
            <InputField ref = {usernameaRef}  placeholder = "enter your email" id = "email" label = "email"/>
            <InputField ref={passwordRef} placeholder= "enter your password" id = "password" label = "password"/>
            <Button onClick={login} varient="primary" title="Login" fullwidth={true}/>
           

        </div>

    </div>
}

