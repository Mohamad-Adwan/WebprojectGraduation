import { createContext, useState, useEffect} from "react";
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

const UserContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [token,setToken] = useState(localStorage.getItem('userToken'));
    
    const getUserData = () => {
     if (token != null) {
         const decoded = jwtDecode(token);
         setUser(decoded);
     }
 }
 useEffect(() => {
     getUserData();
 }, [token])

   return <UserContext.Provider value={{user , setUser, token, setToken}}>
        {children}
   </UserContext.Provider>
    

};

export default UserContextProvider;