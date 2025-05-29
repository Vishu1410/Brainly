export function InputField({placeholder,id,label,ref} : {placeholder:string;id:string;label?:string,ref?: any}){
    return <div className="flex flex-col gap-2">
            <label htmlFor={id} >{label }:</label>
            <input type="text" ref = {ref} placeholder={placeholder} id={id} className="px-4 py-2 rounded border"></input>
    </div>
}