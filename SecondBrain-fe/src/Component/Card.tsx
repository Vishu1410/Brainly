
import { useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { XIcon } from "../Icons/XIcon";
import { YoutubeIcon } from "../Icons/YoutubeIcon";

import { confirmToast } from "../utils/confirmToast";
// import { ShareMenu } from "./ShareMenu";
import { FaFilePdf } from "react-icons/fa"; // Font Awesome PDF icon




interface CardInterface{
    id : string,
    title : string,
    link : string,
    type : "youtube" | "twitter" | "image" | "file",
    onShareClick: (data: { title: string; link: string }) => void;
    onDelete : (id : string) => void
    fileurl : string 
    description ?: string
}

export function Card({id,title,link,type,onShareClick,onDelete,fileurl,description} : CardInterface){

  console.log(fileurl)
     
  
      

  
    
    const getYoutubeEmbedLink = (url: string): string => {
        try {
          const parsedUrl = new URL(url);
          const hostname = parsedUrl.hostname;
          let videoId = "";
      
          // Case: youtu.be short link
          if (hostname === "youtu.be") {
            videoId = parsedUrl.pathname.slice(1);
          }
      
          // Case: standard YouTube links
          if (hostname.includes("youtube.com")) {
            // Case: shorts
            if (parsedUrl.pathname.startsWith("/shorts/")) {
              videoId = parsedUrl.pathname.split("/shorts/")[1];
            }
      
            // Case: embed
            else if (parsedUrl.pathname.startsWith("/embed/")) {
              videoId = parsedUrl.pathname.split("/embed/")[1];
            }
      
            // Case: watch?v=
            else if (parsedUrl.searchParams.has("v")) {
              videoId = parsedUrl.searchParams.get("v") || "";
            }
          }
      
          if (!videoId) return "";
      
          return `https://www.youtube.com/embed/${videoId}`;
        } catch (error) {
          console.error("Invalid YouTube URL:", url);
          return "";
        }
      };
      


     


    return (
    <div>
        
             <div  className=" min-h-80 max-h-80 max-w-80 overflow-auto scrollbar-hide  bg-white rounded-md border shadow-lg mb-2 border-red-700">
              <div className="flex justify-between p-2 ">
                  <div className="flex items-center gap-2 text-2xl font-bold capitalize font-serif">
                      {type === 'youtube' && <YoutubeIcon/>}
                      {type === 'twitter' && <XIcon/>}

                      {title}
                  </div>
                  <div className="flex items-center gap-2">
                      <button onClick={()=> confirmToast({
                        message : "are you sure you want to delete",
                        onConfirm : ()=>onDelete(id),
                      })}><DeleteIcon/></button>


                      <button onClick={() => onShareClick({ title, link })}><ShareIcon size="md"/></button>
                      
                      
                  </div>
              </div>
             <div className=" overflow-auto  rounded-md border-red-900 flex items-center justify-center ">
                 { type === "image"  && (
                    <div className="gap-4">
                      <img src={fileurl} alt="" />
                      <div className="h-20 mt-2 w-full border border-red-900 p-2 rounded-md ">
                        {description}
                      </div>
                    </div>)
                 }

                 { type === "file"  && (
                    <div className="gap-4">
                       <FaFilePdf
                        size={100}
                        color="red"
                        style={{cursor : "pointer"}}
                        onClick={openFileInBrowser}
                      />
                      <div className="h-20 mt-2 w-full border border-red-900 p-2 rounded-md ">
                        {description}
                      </div>
                    </div>)
                 }
                 { type === "youtube" && (
                    <div className="gap-4">
                      <iframe className="w-full flex items-center mt-4 " src={getYoutubeEmbedLink(link)} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                      <div className="h-20 mt-2 w-full border border-red-900 p-2 rounded-md ">
                        hii there
                      </div>
                    </div>)
                 }
                 { type === "twitter" && (
                    <blockquote className="twitter-tweet w-full h-full">
                      <a href= {link.replace("x.com","twitter.com")}></a> 
                    </blockquote>
                    )
                 }

             </div>
     </div>

        
       
    </div>
    )
}
