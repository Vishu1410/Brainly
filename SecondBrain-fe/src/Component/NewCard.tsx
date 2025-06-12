"use client"
import { Share2, Trash2, Calendar, Hash } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

export interface ContentCardProps {
  logo?: string
  title: string
  description: string
//   hashtags: string[]
  createdAt: Date
  contentType: "image" | "youtube" | "twitter" | "file"
//   contentData: {
//     url?: string
//     embedId?: string
//     fileName?: string
//     fileType?: string
//     alt?: string
//   }
  url?:string

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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const renderContent = () => {
    switch (contentType) {
      case "image":
        return (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
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
            <iframe
              src={`https://www.youtube.com/embed/${contentData.embedId}`}
              title="YouTube video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )

      case "twitter":
        return (
          <div className="relative w-full min-h-64 bg-gray-100 rounded-lg overflow-hidden p-4">
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">T</span>
                </div>
                <p className="text-sm">Twitter Embed</p>
                <p className="text-xs text-gray-400 mt-1">{url}</p>
              </div>
            </div>
          </div>
        )

      case "file":
        return (
          <div className="relative w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold text-xs">
                    {"FILE"}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700">{ "Document"}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-md mx-auto `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={logo || "/placeholder.svg?height=40&width=40"}
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="font-semibold text-gray-900 truncate max-w-32">{title}</h3>
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
            onClick={onDelete}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">{renderContent()}</div>

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
