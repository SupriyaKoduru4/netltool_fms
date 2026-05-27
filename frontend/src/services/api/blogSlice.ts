import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery :fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => '/blog/all',
    }),
    getBlogById: builder.query({
      query: (id) => `/blog/${id}`,
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogByIdQuery } = blogApi;