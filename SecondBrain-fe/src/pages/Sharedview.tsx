import { BACKEND_URL } from '@/config';
import axios from 'axios';
import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NewCard from '@/Component/NewCard';

 interface ContentCardProps {
    logo?:string
    title: string
    description: string
  //   hashtags: string[]
    createdAt: Date
    type: "image" | "youtube" | "twitter" | "file"
    fileurl:string
    textContent : string
    fileName : string
    onDelete?: () => void
    onShare?: () => void
  //   className?: string
  }

const Sharedview = () => {
    const {shareToken} = useParams();
    const [content,setContent] = useState<ContentCardProps | null>(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchSharedContent = async ()=>{
            try {
                const res = await axios.get(BACKEND_URL+`/api/v1/shared/${shareToken}`,{
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                });
                setContent(res.data.content)
            } catch (error) {
                console.error("error while fetching content : ",error)
            }
            finally{
                setLoading(false)
            }
        }
        fetchSharedContent()
    },[shareToken])
    if (loading) return <div className="p-4 text-gray-600">Loading shared content...</div>;
    if (!content) return <div className="p-4 text-gray-600">Content not found...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <NewCard
        title={content.title}
        description={content.description}
        contentType={content.type}
        fileName={content.fileName}
        url={content.fileurl}
        textContent={content.textContent}
        createdAt={new Date(content.createdAt)}
        onDelete={undefined} // hide delete in shared view
        onShare={undefined}  // optional: hide share again
      />
    </div>
  )
}

export default Sharedview
