import { createContext, useContext, useState } from 'react'; 
import { initialTasks } from '../utils/mockData';  
const TasksContext = createContext();  
export const TasksProvider = ({ children }) => {
    
    const [tasks, setTasks] = useState(initialTasks);   

    return (         
    <TasksContext.Provider             
    value={{                 
        tasks,                 
        setTasks,             
    }}         
    >             
        {children}         
    </TasksContext.Provider>     
    ); 
};  

export const useTasks = () => useContext(TasksContext); 