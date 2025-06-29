import axios from 'axios';
import  { useEffect, useState } from 'react'
import { BACKEND_URL } from '../config';

const usegetContent = () => {
  const [contentArray,setContentArray] = useState([]);

  async function fetchdata(){
        try {
            console.log(localStorage.getItem("token"))
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
            console.log(contentId);
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

  useEffect(
    ()=>{   
        fetchdata()
  },[])


  return {contentArray,deleteContent}
}

export default usegetContent
