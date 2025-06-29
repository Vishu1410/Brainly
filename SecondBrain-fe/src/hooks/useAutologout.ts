import { useEffect, useRef } from "react"


const useAutologout = (logout:()=>void,timeoutMinutes = 15) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = ()=>{
        if(timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(()=>{
            logout()
        },timeoutMinutes * 60 * 1000)
    }

    useEffect(()=>{
        const events = ["mousemove","keydown","click"];

        const activityHandler = () => resetTimer();
        
        events.forEach(event => window.addEventListener(event,activityHandler))

        resetTimer()

        return ()=>{
            events.forEach(event=>window.removeEventListener(event,activityHandler));
            if(timerRef.current) clearTimeout(timerRef.current)
        }
    },[])

  
}

export default useAutologout
