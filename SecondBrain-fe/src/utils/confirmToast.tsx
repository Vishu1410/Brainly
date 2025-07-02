import toast, { ToastPosition } from "react-hot-toast";

interface ConfirmToastProps { 
    message : string;
    onConfirm : () => void;
    onCancle? : () => void;
    position?: ToastPosition;

}

export function confirmToast({message,onConfirm,onCancle,position = "top-center"} : ConfirmToastProps){
    toast((t)=> (
        <span className="flex flex-col">
          <p className="font-medium">{message}</p>
          <div className="flex gap-2 mt-2"> 
            <button className="px-3 py-1 bg-red-500 text-white rounded"
             onClick={()=>{
                onConfirm();
                toast.dismiss(t.id);
                toast.success("content deleted",{
                  duration : 3000
                })
                
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
      ),{id : "confirm-toast",position})
}