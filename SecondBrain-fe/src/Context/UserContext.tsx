import { createContext, ReactNode, useContext, useState } from "react";


interface UserContextType{
    brainToken : string | null,
    username : string | null,
    setUser : (user : {brainToken : string; username : string}) => void;
    logout : ()=>void
}


const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
  }



export const UserProvider = ({ children } : UserProviderProps) => {
    
    const [brainToken,setBrainToken] = useState<string | null>(null)
    const [username,setUsername] = useState<string |null>(null);


    const setUser = ({brainToken,username} : {brainToken : string; username : string}) =>{
        setBrainToken(brainToken);
        setUsername(username)
    }

    const logout = ()=>{
        setBrainToken(null);
        setUsername(null)
    }

    return (
        <UserContext.Provider value={{brainToken,username,setUser,logout}}>
            {children}
        </UserContext.Provider>
    )

} 

export const useUser = ()=>{
    const ctx = useContext(UserContext);
    if(!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}