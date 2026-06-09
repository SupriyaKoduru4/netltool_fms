import react, { useContext, useEffect, useState } from 'react'
import { createContext } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import Register from '../pages/Register';
import { useNavigate } from 'react-router-dom';
import { useGetRolesPermissionsQuery } from '../services/api/userSlice';

interface IAppData{
    user:any ; 
    appLoading:boolean ;
    authLoading:boolean;
    isError:boolean;
    error:any;
    permissions:any;
    isLoggedIn:boolean;
    login:({email,password}:{email:string,password:string})=>Promise<void>;
    logout:()=>void;
}

const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';


export const AppDataContext = createContext<IAppData | null>(null)

export function AppProvider({children}:{children:react.ReactNode}){

    const [user, setUser] = react.useState<any>(null);
    const [appLoading, setAppLoading] = react.useState(true);
    const [authLoading, setAuthLoading] = react.useState(false);
    const [isError, setIsError] = react.useState(false);
    const [error, setError] = react.useState<any|null>(null);
    const [isLoggedIn, setIsLoggedIn] = react.useState(false);
    const [permissions , setPermissions] = useState<any>(null)

    //navigate
    const navigate = useNavigate();

    //check is logged and get user details
    async function checkLoggedIn(){
        try{
        setAppLoading(true);
        const token = localStorage.getItem('token');
        if(token){
            setIsLoggedIn(true);
            //fetch user details
            const response = await axios.get(`${BASE_URL}/auth/user-details`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            
            console.log('User details fetched successfully:', response.data);
        }
        }catch(error){
            console.error('Error checking login status:', error);
            setIsError(true);
            setIsLoggedIn(false)
            setError(error || 'An error occurred while checking login status');
        }finally{
            setAppLoading(false);
        }
    }

    async function getRolePermission(){
        if(!user)return 
        console.log(user)
        setAppLoading(true)
        try{
            
            const response = await axios.get(`${BASE_URL}/role-permission/get-permissions-for-role/${user?.role_id}`)
            console.log('this response' , response)
            setPermissions(response?.data?.permissions)
        }catch(err){
            console.log(err)
        }finally{
            setAppLoading(false)
        }
    }

    useEffect(()=>{
        checkLoggedIn();
        
    },[])

    useEffect(()=>{
        getRolePermission();
    } , [user])


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
            checkLoggedIn();
            navigate('/' , {replace:true});
            
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
        navigate('/login', {replace:true});
        toast.success('Logged out successfully!');
    }
    
    return <AppDataContext.Provider value={{permissions ,login, logout , user, appLoading, authLoading, isError, error, isLoggedIn}}>
        {children}
    </AppDataContext.Provider>
}

export function useAppData(){
    const context = useContext(AppDataContext);

    if(!context) throw new Error('No context found')

    return context
}