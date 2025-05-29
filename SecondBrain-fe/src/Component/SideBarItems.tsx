import { ReactElement } from "react";

export function SideBarItems({text,icon} : {
    text : string,
    icon : ReactElement
}){
    return <div className="flex cursor-pointer">
        <div className="p-2">
            {icon}
        </div>
        <div className="p-2">
            {text}
        </div>
    </div>
}