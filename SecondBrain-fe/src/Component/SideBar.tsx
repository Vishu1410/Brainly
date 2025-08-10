// import { XIcon } from "../Icons/XIcon";
// import { YoutubeIcon } from "../Icons/YoutubeIcon";
// import { SideBarItems } from "./SideBarItems";
// import { Logo } from "../Icons/logo";
import { Brain, Youtube, Twitter, ImageIcon, Video, File, LogOut, Text, Database } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
  } from "@/components/ui/sidebar"
import { confirmToast } from "@/utils/confirmToast";


  interface SideBarProps extends React.ComponentProps<typeof Sidebar> {
    onSelectType: (type: string) => void;
  }
  

  const navigationItems = [
    {
      title : "all",
      icon : Database
    },
    {
      title : "text",
      icon : Text
    },
    {
      title: "youtube",
      url: "#",
      icon: Youtube,
    },
    {
      title: "twitter",
      url: "#",
      icon: Twitter,
    },
    {
      title: "image",
      url: "#",
      icon: ImageIcon,
    },
    {
      title: "video",
      url: "#",
      icon: Video,
    },
    {
      title: "file",
      url: "#",
      icon: File,
    },
  ]



const SideBar = ({ onSelectType, ...props }: SideBarProps) => {

    const handleLogout = ()=>{
      localStorage.removeItem("token");
      localStorage.removeItem("brainToken");
      window.location.href = "/login"
    }

    return (
        <Sidebar {...props}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <button onClick={()=>{
                    window.location.reload()
                  }} className="flex items-center gap-2 cursor-pointer ">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Brain className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-bold text-lg">Brainly</span>
                    </div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
    
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button className="flex items-center gap-2 cursor-pointer"
                        onClick={()=>onSelectType(item.title)}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
    
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={()=> confirmToast({
                    message : "Are you sure you want to logout ? ",
                    onConfirm : handleLogout,
                    position : "bottom-left"
                  })} className="flex items-center gap-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
    
          <SidebarRail />
        </Sidebar>
      )
}

export default SideBar

