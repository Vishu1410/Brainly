import { useRef } from "react";
import { CloseIcon } from "../Icons/CloseIcon";
import { Button } from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function CreateContentModel({open,close}){

    const titleref = useRef<HTMLInputElement>()
    const linkref = useRef<HTMLInputElement>()
    const typeref = useRef<HTMLInputElement>()

    async function handlecontent(){



        try{
            
            const title = titleref.current?.value;
            const link = linkref.current?.value;
            const type = typeref.current?.value;

            await axios.post(BACKEND_URL+"/api/v1/content",{
                link,
                type,
                title
            },{
                headers:{
                    "Authorization": localStorage.getItem("token")
                }
            })
            alert("content added succesfully....")

        }catch(error){
            alert("error occur... fix it");
            console.log(error);      
        }
        

    }

    

    return <div>
        { open && <div className="h-screen w-screen bg-slate-500 fixed top-0 left-0 flex justify-center opacity-80">
            <div className="flex flex-col justify-center ">
                <span className="bg-white opacity-100 p-4 rounded">
                    <div className="flex justify-end">
                        <div onClick={close} className="cursor-pointer">
                            <CloseIcon/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <DropDown ref={typeref}/>
                        <Input ref = {titleref} placeholder = {"title"}/>
                        <Input ref = {linkref} placeholder = {"link"}/>
                        <Button onClick={handlecontent} title="Submit" varient="primary"/>
                    </div>

                    {/* <div className="flex justify-center">
                        <Button onClick={handlecontent} title="Submit" varient="primary"/>
                    </div> */}

                </span>
                
            </div>


        </div>}
    </div>
}

function Input({ref,placeholder} : {ref:any,placeholder:string}){

    return <div>
        <input type={"text"} placeholder={placeholder} ref = {ref} className="px-4 py-2 rounded border"></input>
     </div>
    
}

function DropDown({ref} : {ref : any}){
    return (
        <div>
            <label>select an option : </label>
                <select ref={ref}>

                    <option value=""></option>
                    <option value="youtube">youtube</option>
                    <option value="twitter">twitter</option>
                </select>
        </div>
    )
}