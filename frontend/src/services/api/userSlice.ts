import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const usersApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL ,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
    
    }}),
    
     tagTypes: ["Users", "UserDetail", "Roles", "Permissions", "RolePermissions"],
    endpoints: (builder) => ({

        getUsers: builder.query({
            query: () => "/auth/users",
            providesTags: (result) => {
                const list = Array.isArray(result)
                    ? result
                    : result?.users ?? result?.data ?? [];

                return [
                    ...list.map(({ id }: { id: string }) => ({ type: "Users" as const, id })),
                    { type: "Users", id: "LIST" },
                ];
            },
        }),
        getUserDetails: builder.query({
            query: (id: string) => `/auth/get-user/${id}`,
            providesTags: (_result, _err, id) => [{ type: "UserDetail", id }],
        }),

        //role and permissions
           getRoles: builder.query({
            query: () => '/role-permission/roles',
            providesTags: [{ type: "Roles", id: "LIST" }],
        }),

        getPermissions: builder.query({
            query: () => '/role-permission/permissions',
            providesTags: [{ type: "Permissions", id: "LIST" }],
        }),

        createRoles: builder.mutation({
            query: (body) => ({
                url: "/role-permission/create-role",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
        }),

        getRolesPermissions: builder.query({
            query: () => "/role-permission/role-permissions",
            providesTags: [{ type: "RolePermissions", id: "LIST" }],
        }),

        updateRolePermissions: builder.mutation({
            query: (body) => ({
                url: "/role-permission/assign-permission-to-role",
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "RolePermissions", id: "LIST" }],
        }),


        adminUpdateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `/auth/admin-user-update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Users", id: "LIST" },
                { type: "UserDetail", id },
            ],
        }),

        createUser: builder.mutation({
            query: (body) => ({
                url: "/auth/create-user-for-login",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "LIST" }],
        }),

        disbaleUser: builder.mutation({
            query: (user_id) => ({
                url: `/auth/user-disable/${user_id}`,
                method: "PUT",
            }),
            invalidatesTags: (_result, _err, user_id) => [
                { type: "Users", id: "LIST" },
                { type: "UserDetail", id: user_id },
            ],
        }),

        deleteUser: builder.mutation({
            query: (user_id) => ({
                url: `/auth/delete-user/${user_id}`,
                method: "PUT",
            }),
            invalidatesTags: (_result, _err, user_id) => [
                { type: "Users", id: "LIST" },
                { type: "UserDetail", id: user_id },
            ],
        }),
        updateUserProfile: builder.mutation({
            query: ({ body }) => ({
                url: `/auth/update-profile`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: "Users", id: "LIST" },
                { type: "UserDetail", id },
            ],
        }),
        RequestPasswordReset: builder.mutation({
            query: (body) => ({
                url: "/auth/reset-password-request",
                method: "POST",
                body:body,
            }),
                invalidatesTags: [{ type: "Users", id: "LIST" }],
        }),
        resendInvitation:builder.mutation({
            query:(id)=>({
                url:`/auth/resend-invitation/${id}`,
                method:"POST"
            })
        })
        
    }),
});

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useGetRolesQuery,
    useAdminUpdateUserMutation,
    useCreateUserMutation,
    useDisbaleUserMutation,
    useDeleteUserMutation,
    useGetPermissionsQuery , 
    useCreateRolesMutation , 
    useGetRolesPermissionsQuery , 
    useUpdateRolePermissionsMutation , 
    useUpdateUserProfileMutation, 
    useRequestPasswordResetMutation , 
    useResendInvitationMutation
} = usersApi;