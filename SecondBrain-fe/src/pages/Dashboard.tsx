import { useState } from "react";
import { Button } from "../Component/Button";
import { Card } from "../Component/Card";
import { PlusIcon } from "../Icons/PlusIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { CreateContentModel } from "../Component/CreateContentModel";
import { SideBar } from "../Component/SideBar";
import usegetContent from "../hooks/usegetContent";
import { ShareMenu } from "../Component/ShareMenu";




export default function Dashboard() {

  const {contentArray,deleteContent} = usegetContent()
  
  const [ModelOpen,setModelOpen] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; link: string } | null>(null);

  const onShareClick = (data: { title: string; link: string }) => {
    setShareData(data);
    setShareOpen(true);
  };
  
    console.log(contentArray)

    

  return <div>


    <SideBar/>

    
    

    <div className="p-2 ml-72 min-h-screen bg-gray-100 border-2">

      <CreateContentModel open={ModelOpen} close={()=>{
        setModelOpen(false)
      }}/>
      
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

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mt-2  border-red-500">

        { contentArray.map((item : any)=>(
          <Card id={item._id} key = {item._id} onShareClick={onShareClick}  title={item.title} type={item.type} link= {item.link} onDelete={()=>deleteContent(item._id)} />
        ))}
        

        
      </div>

   </div>
    
      
  </div>
  
}