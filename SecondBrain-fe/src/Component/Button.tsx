import { ReactElement } from "react"

interface ButtonInterface{
    title : string,
    onClick? : ()=> void,
    startIcon? : ReactElement,
    varient : "primary" | "secondry",
    fullwidth? : boolean
}

// const sizeStyles = {
//     "sm" : "px-2 py-1 text-sm rounded-sm",
//     "md" : "px-4 py-2 text-md rounded-md",
//     "lg" : "px-8 py-4 text-xl rounded-xl"
// }

const varientStyles = {
    "primary" : "bg-purple-600 text-white",
    "secondry" : "bg-purple-300 text-purple-600"
}

const defaultStyle = "px-4 py-2 rounded-md flex items-center gap-1 cursor-pointer ";


export function Button(props : ButtonInterface){
    return <button onClick={props.onClick} className={varientStyles[props.varient] +" "+defaultStyle + `${props.fullwidth ? " w-full flex justify-center" : ""}`}>
        {props.startIcon}
        {props.title}
        
        
    </button>
}