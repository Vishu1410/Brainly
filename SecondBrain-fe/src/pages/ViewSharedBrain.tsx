import { BACKEND_URL } from '@/config';
import axios from 'axios';
import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NewCard from '@/Component/NewCard';

const ViewSharedBrain = () => {

    const { brainToken } = useParams();
    const [contents, setContents] = useState([]);

    useEffect(()=>{
        if(brainToken){
            axios.get(BACKEND_URL+`/api/v1/sharebrain/${brainToken}`).then(res => setContents(res.data)).catch(error => console.error("error fatching shareBrain",error))

            console.log("inside viewshare brain : " + contents)
        }
        else{
          console.log("token not provided...")
        }

    },[brainToken])

  return (
    <div className="p-4 min-h-screen bg-gray-100">
    <h2 className="text-2xl font-bold mb-4">Shared Brain</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((item: any) => (
        <NewCard 
        title={item.title} 
        description={item.description} 
        contentType={item.type}
        fileName={item.fileName}
        textContent={item.textContent}
        url={item.fileurl}
        createdAt={new Date(item.createdAt)}
       />
      ))}
    </div>
  </div>
  )
}

export default ViewSharedBrain
