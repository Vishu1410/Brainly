import toast from "react-hot-toast";

interface ConfirmToastProps { 
    message : string;
    onConfirm : () => void;
    onCancle? : () => void;

}

export function confirmToast({message,onConfirm,onCancle} : ConfirmToastProps){
    toast((t)=> (
        <span className="flex flex-col">
          <p className="font-medium">{message}</p>
          <div className="flex gap-2 mt-2"> 
            <button className="px-3 py-1 bg-red-500 text-white rounded"
             onClick={()=>{
                onConfirm();
                toast.dismiss(t.id);
                toast.success("content deleted")

              }
             }> YES</button>

              <button className="px-3 py-1 bg-gray-200 rounded"
              onClick={()=>{
                    onCancle?.();
                    toast.dismiss(t.id);    
              }}>
                  NO
              </button>

          </div>
        </span>
      ),{duration : Infinity,id : "confirm-toast"})
}