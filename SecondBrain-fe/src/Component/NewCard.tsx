"use client"
import { Share2, Trash2, Calendar, Hash, ImageIcon, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { YoutubeIcon } from "@/Icons/YoutubeIcon"
import { XIcon } from "@/Icons/XIcon"
import { confirmToast } from "@/utils/confirmToast"

// import { Logo } from "@/Icons/logo"
// import { Badge } from "@/components/ui/badge"



export interface ContentCardProps {
  logo?:string
  title: string
  description: string
//   hashtags: string[]
  createdAt?: Date
  contentType: "image" | "youtube" | "twitter" | "file"
  url:string

  onDelete?: () => void
  onShare?: () => void
//   className?: string
}

export default function NewCard({
  logo,
  title,
  description,
//   hashtags,
  createdAt,
  contentType,
//   contentData,
    url,
  onDelete,
  onShare,
//   className = "",
}: ContentCardProps) {

  const formatDate = (createdAt: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(createdAt)
  }

 


 

const getLogoByType = (type: string): React.ReactNode => {
  switch (type) {
    case "image":
      return <ImageIcon className="w-6 h-6 text-pink-500" />;
    case "youtube":
      return <YoutubeIcon/>;
    case "twitter":
      return <XIcon/>;
    
    default:
      return <FileTextIcon className="w-6 h-6 text-gray-400" />; // fallback
  }
};




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
 

  const renderContent = () => {
    switch (contentType) {
      case "image":
        return (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden ">
            <img
              src={url || "/placeholder.svg?height=256&width=400"}
            //   alt={contentData.alt || "Content image"}
              className="w-full h-full object-cover"
            />
          </div>
        )

      case "youtube":
       
        return (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <iframe className="w-full h-full " src={getYoutubeEmbedLink(url)} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        )

      case "twitter":
        const fixedUrl = url ? url.replace("https://x.com", "https://twitter.com") : "";
        return (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-auto ">
           
                
                <blockquote className="twitter-tweet w-full h-full">
                      <a href= {fixedUrl}></a> 
                    </blockquote>

          </div>
                 
              
          
        )

      case "file":
        const fileExtension = url?.split(".").pop()?.toLowerCase(); // Get 'pdf' or 'docx'

        // Define styles based on extension
        const isPDF = fileExtension === "pdf";
        const isDOCX = fileExtension === "docx";
      
        const iconBgColor = isPDF ? "bg-red-100" : isDOCX ? "bg-blue-100" : "bg-gray-100";
        const iconTextColor = isPDF ? "text-red-600" : isDOCX ? "text-blue-600" : "text-gray-600";
        const label = isPDF ? "PDF" : isDOCX ? "DOCX" : "FILE";
        return (
          <a href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block">
            <div className="relative w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <span className={`font-semibold text-xs ${iconTextColor}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{ "Document"}</p>
                </div>
              </div>
            </div>
          </a>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full mx-auto m-2  `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 w-full ">
        <div className="flex items-center space-x-3">
          {/* <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          /> */}
          <div className="w-10 h-10 rounded-full object-cover flex items-center justify-center ">
            {getLogoByType(contentType)}
          </div>
          <h3 className="font-semibold capitalize  text-gray-900 truncate max-w-32">{title}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={()=>confirmToast({
              message : "Are you sure you want to delete this content ?",
              onConfirm: onDelete ?? (() => {}),
              duration : 3000
            })}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 w-full">{renderContent()}</div>

      {/* Description */}
      <div className="px-4 pb-2">
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Hashtags */}
      {/* {hashtags.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )} */}

      {/* Footer */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  )
}
