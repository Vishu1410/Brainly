import { XIcon } from "../Icons/XIcon";
import { YoutubeIcon } from "../Icons/YoutubeIcon";
import { SideBarItems } from "./SideBarItems";
import { Logo } from "../Icons/logo";

export function SideBar(){
    return <div className="h-screen bg-white w-72 border-r fixed left-0 top-0 pl-2">
        <div className="flex text-2xl items-center gap-2 pt-2 pb-4 ">
            <Logo/>
            Brainly
        </div>
        <div className="flex flex-col items-start pl-4 ">
        <SideBarItems text="Youtube" icon={<YoutubeIcon/>}/>
        <SideBarItems text="twitter" icon={<XIcon/>}/>

        </div>
            
    </div>
}