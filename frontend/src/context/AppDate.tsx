import react, { useContext } from 'react'
import { createContext } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

interface IAppData{
    user:any ; 
    appLoading:boolean ;
    authLoading:boolean;
    isError:boolean;
    error:any;
    isLoggedIn:boolean;
    login:({email,password}:{email:string,password:string})=>Promise<void>;
    logout:()=>void;
}

const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';


export const AppDataContext = createContext<IAppData | null>(null)

export function AppProvider({children}:{children:react.ReactNode}){

    const [user, setUser] = react.useState(null);
    const [appLoading, setAppLoading] = react.useState(false);
    const [authLoading, setAuthLoading] = react.useState(false);
    const [isError, setIsError] = react.useState(false);
    const [error, setError] = react.useState(null);
    const [isLoggedIn, setIsLoggedIn] = react.useState(false);

    //check is logged and get user details

    

    //register 

    //login function
    async function login({email,password}:{email:string,password:string}){
        try{
            setAuthLoading(true);
            const reponse =  await axios.post(`${BASE_URL}/auth/login`, { email, password });
            const { access_token} = reponse.data;
            localStorage.setItem('token', access_token);
            setIsLoggedIn(true);
            console.log('Login successful:', reponse.data);
            toast.success('Login successful!');
        }catch(error){
            console.error('Login failed:', error);
            setIsError(true);
            // setError(error || 'An error occurred during login');
            toast.error('Login failed. Please check your credentials and try again.');  
        }finally{
            setAuthLoading(false);
        }
    }

    //logout function
    async function logout(){
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
    }
    
    return <AppDataContext.Provider value={{login, logout , user, appLoading, authLoading, isError, error, isLoggedIn}}>
        {children}
    </AppDataContext.Provider>
}

export function useAppData(){
    const context = useContext(AppDataContext);

    if(!context) throw new Error('No context found')

    return context
}