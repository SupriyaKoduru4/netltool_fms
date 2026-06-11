import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const blogApi = createApi({
  reducerPath: "blogApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Blog", "Stats"],

  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "/blog/all",

      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id) => `/blog/${id}`,

      providesTags: (result, error, id) => [
        { type: "Blog", id },
      ],
    }),

    getStats: builder.query({
      query: () => "/stats/all",

      providesTags: ["Stats"],
    }),

    createBlog: builder.mutation({
      query: (body) => ({
        url: "/blog/create",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Blog", "Stats"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (result, error, { id }) => [
        "Stats",
        "Blog",
        { type: "Blog", id },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        "Stats",
        "Blog",
        { type: "Blog", id },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useGetStatsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;