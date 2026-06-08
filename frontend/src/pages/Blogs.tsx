import {useNavigate} from 'react-router-dom'
import { useState } from "react";

import LoginBar from "../components/Home/LoginBar"
import Button from "../components/UI/Button"
import CustomTable from "../components/UI/CustomTable"
import OptionsContainer from "../components/UI/OptionsContainer"
import { useGetBlogByIdQuery, useGetBlogsQuery } from '../services/api/blogSlice'
import BlogsTableSkeleton from '../components/Loading/SkeletonTable'
import SkeletonTable from '../components/Loading/SkeletonTable'

import { MoreVertical } from "lucide-react";
//@ts-ignore
import viewIcon from "../assets/View.svg";
//@ts-ignore
import editIcon from "../assets/Edit.svg";
//@ts-ignore
import copyIcon from "../assets/Copy.svg";
//@ts-ignore
import shareIcon from "../assets/Share.svg";
//@ts-ignore
import deleteIcon from "../assets/Delete.svg";

const blogData = [
    {id: 1, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 2, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 3, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 4, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 5, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 6, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 7, title: "Getting Started with React", author: "John Doe", date: "2024-01-15", actions: "Edit"},
    {id: 8, title: "Advanced TypeScript Patterns", author: "Jane Smith", date: "2024-01-20", actions: "Edit"},
    {id: 9, title: "Web Performance Optimization", author: "Mike Johnson", date: "2024-01-25", actions: "Edit"},
]

const Blogs = ()=>{

    const navigate = useNavigate()
      const [openMenu, setOpenMenu] = useState<number | null>(null);

    // service apis
    const {data , isLoading , isError , error} = useGetBlogsQuery("blogs")
    console.log("Blogs data: ", data, isLoading, )

     const handleCreateNewBlog = () => {
        navigate("/blog-editor");
      };

      
const column = [
    {key:"id" , label:"id"},
    {key: "title", label: "Title",
        render: (value: any, row: any) => (
            <button 
            onClick={() => navigate(`/blog/${row._id || row._id}`)}
            className='text-left font-medium hover:text-back-700 hover:underline'>
                {value}
            </button>
        )
    },
    {key: "author_id", label: "Author"},
    {key:"summary" , label:"Summary"},
    {key: "date", label: "Date"}, 
       {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(
                openMenu === row.id
                  ? null
                  : row.id
              );
            }}
            className="rounded border border-gray-300 p-2 hover:bg-gray-100"
          >
            <MoreVertical size={16} />
          </button>

          {openMenu === row.id && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-md border border-gray-200 bg-white shadow-lg">

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100">
                <img
                  src={viewIcon}
                  alt="view"
                  className="h-4 w-4"
                />
                View Blog
              </button>

              <button
                onClick={() =>
                  navigate(`/blog-editor/${row.id}`)
                }
                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
              >
                <img
                  src={editIcon}
                  alt="edit"
                  className="h-4 w-4"
                />
                Edit Blog
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100">
                <img
                  src={copyIcon}
                  alt="copy"
                  className="h-4 w-4"
                />
                Copy
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100">
                <img
                  src={shareIcon}
                  alt="share"
                  className="h-4 w-4"
                />
                Share
              </button>

              <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
                <img
                  src={deleteIcon}
                  alt="delete"
                  className="h-4 w-4"
                />
                Delete Blog
              </button>

            </div>
          )}
        </div>
      ),
    },
  ];

      if(isLoading) {
        return <OptionsContainer>
            <SkeletonTable/>
        </OptionsContainer>
      }

      if(isError){
        <OptionsContainer>
            <div>
                <h1>Something went wrong</h1>
                <p></p>
            </div>
        </OptionsContainer>
      }

    return <div>
        <OptionsContainer>
            <div className="p-6" >
                <div className="flex flex-row justify-between mb-4">
                    <div>
                       <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          Blogs / Notes
                       </h1>
                        <p className="text-sm text-gray-500">
                         Record, edit, and manage your Blog posts.
                        </p>
                    </div>
                     
                     <div >
                        <Button text=" + Create New Blog  " onClick={handleCreateNewBlog} variant="primary"/>
                     </div>

                </div>
              
                <div>
                    <CustomTable columns={column}  data={data?.blogs || []}/>
                </div>
            </div>
        </OptionsContainer>
    </div>
}

export default Blogs


