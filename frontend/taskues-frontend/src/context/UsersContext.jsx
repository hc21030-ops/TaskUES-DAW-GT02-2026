import { createContext, useContext, useState } from 'react'; 
import { MOCK_USERS } from '../utils/constants';  
const UsersContext = createContext();  
export const UsersProvider = ({ children }) => {
    
    const [users, setUsers] = useState(MOCK_USERS);  

    return (         
    <UsersContext.Provider             
    value={{                 
        users,                 
        setUsers,             
    }}         
    >             
        {children}         
    </UsersContext.Provider>     
    ); 
};  

export const useUsers = () => useContext(UsersContext); 