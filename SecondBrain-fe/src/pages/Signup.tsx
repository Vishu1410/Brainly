import { useRef } from "react";
import { Button } from "../Component/Button";
import { InputField } from "../Component/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";



export const Signup = ()=>{
    
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    // const confirmpasswordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();


    async function signup(){
        try{
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;
            // const confirmpassword =  confirmpasswordRef.current?.value
            await axios.post(BACKEND_URL+"/api/v1/signup",{
                
                    username,
                    password
                
            })
            alert("you are signed up...");
            navigate("/login");

        }catch(error){
            console.log(error);
            alert("error occur");
        }
        

    }
    return <div className="h-screen w-screen bg-red-300 flex justify-center items-center ">

        <div className="w-80 h-80 rounded-xl bg-white flex flex-col p-2 gap-2  p-6">

            <InputField ref = {usernameRef} placeholder = "enter your email" id = "email" label = "email"/>
            <InputField  ref = {passwordRef} placeholder = "enter your password" id = "password" label = "password"/>
            {/* <InputField ref = {confirmpasswordRef} placeholder = "confirm your password" id = "password" label = "confirm password"/> */}
            <div >
            <Button onClick={signup} varient="primary" title="Signup" fullwidth={true}/>
            </div>
            
           

        </div>

    </div>
}

