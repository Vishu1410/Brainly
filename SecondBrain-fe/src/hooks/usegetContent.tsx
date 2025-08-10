import axios from 'axios';
import  { useEffect, useState } from 'react'
import { BACKEND_URL } from '../config';

const usegetContent = () => {
  const [contentArray,setContentArray] = useState<any[]>([]);

  async function fetchdata(){
        try {
           
            const res = await axios.get(BACKEND_URL+"/api/v1/content",{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            });
            setContentArray(res.data.content)
        } catch (error) {
            console.error("error while fetch data...",error)
        }
    }

    async function deleteContent(contentId : string){
        try {
            await axios.delete(BACKEND_URL+`/api/v1/delete/${contentId}`,{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })
            //@ts-ignore
            setContentArray((prev) => prev.filter((item)=> item._id !== contentId))

            
        } catch (error) {
            console.error("error while deleting..", error)
        }
    }

    const addContentToState = (newContent : any)=>{
        setContentArray((prev) => [newContent, ...prev])
    }

  useEffect(
    ()=>{   
        fetchdata()
  },[])


  return {contentArray,deleteContent,addContentToState}
}

export default usegetContent
