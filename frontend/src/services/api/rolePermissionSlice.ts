import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const rolePermissionRoleSlice = createApi({
    reducerPath:"rolePermission" , 
    baseQuery:fetchBaseQuery({
        baseUrl:API_BASE_URL
    }),
    endpoints:(builder)=>({
        getPermission:builder.query({
            query:()=>"/role-permission/permissions"
        })
    })
})

export const {useGetPermissionQuery} = rolePermissionRoleSlice