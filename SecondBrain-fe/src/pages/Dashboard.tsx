import { useState } from "react";
import { Button } from "../Component/Button";
import { PlusIcon } from "../Icons/PlusIcon";
import { ShareIcon } from "../Icons/ShareIcon";
// import { CreateContentModel } from "../Component/CreateContentModel";

import usegetContent from "../hooks/usegetContent";
import { ShareMenu } from "../Component/ShareMenu";
import InputCard from "../Component/InputCard";
import NewCard from "@/Component/NewCard";
import SideBar from "@/Component/SideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Dashboard() {

  const {contentArray,deleteContent} = usegetContent()
  console.log(contentArray)
  
  const [ModelOpen,setModelOpen] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; link: string } | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
 


  const onShareClick = (data: { title: string; link: string }) => {
    setShareData(data);
    setShareOpen(true);
  };
  
    

    

  return <div>
    <SidebarProvider>
      <SidebarInset>
        <SideBar onSelectType={(type) => setSelectedType(type)}  />
        
        

    <div className= "p-2 ml-65 min-h-screen bg-gray-100 border-2" >

      
      {ModelOpen && <InputCard onClose={() => setModelOpen(false)} />}
      
      {shareOpen && shareData && (
          <ShareMenu
            title={shareData.title}
            link={shareData.link}
            onClose={() => setShareOpen(false)}
          />
        )}
      <div className="flex justify-between ">
        <div className="uppercase font-bold blue-300 text-3xl font-mono ">
            <p>dashboard</p>
        </div>
        
        
        <div className="flex justify-end gap-3 ">
          
          <Button onClick = {()=> {setModelOpen(true)}} title="Add Content" startIcon={<PlusIcon size="md"/>} varient="primary" />
          <Button title="Share Brain" startIcon={<ShareIcon size="md"/>} varient="secondry" />
        </div>
      </div>

      <div className=" gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  border-red-500">

        { contentArray.filter((item: any) => !selectedType || item.type === selectedType).map((item : any)=>(
          <NewCard title={item.title} description={item.description} contentType={item.type} url={item.fileurl} onDelete={()=>deleteContent(item._id)} onShare={()=> onShareClick}/>
        ))}
        
        
        
      </div>

   </div>
    
   </SidebarInset>
   </SidebarProvider>
      
  </div>
  
}