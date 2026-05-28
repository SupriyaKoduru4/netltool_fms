import {useNavigate} from 'react-router-dom'

import LoginBar from "../components/Home/LoginBar"
import Button from "../components/UI/Button"
import CustomTable from "../components/UI/CustomTable"
import OptionsContainer from "../components/UI/OptionsContainer"
import { useGetBlogByIdQuery, useGetBlogsQuery } from '../services/api/blogSlice'
import BlogsTableSkeleton from '../components/Loading/SkeletonTable'
import SkeletonTable from '../components/Loading/SkeletonTable'

const column = [
    {key:"id" , label:"id"},
    {key: "title", label: "Title"},
    {key: "author_id", label: "Author"},
    {key:"summary" , label:"Summary"},
    {key: "date", label: "Date"}, 
    {key: "actions", label: "Actions"},
] 

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

    // service apis
    const {data , isLoading , isError , error} = useGetBlogsQuery("blogs")
    console.log("Blogs data: ", data, isLoading, )

     const handleCreateNewBlog = () => {
        navigate("/blog-editor");
      };

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
                <div className="flex flex-row justify-between">
                    <div>
                       <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Blogs / Notes
            </h1>
            <p className="text-sm text-gray-500">
              Record, edit, and manage your Blog posts.
            </p>
                    </div>
                     
                     <div>
                        <Button text="Create New Blog + " onClick={handleCreateNewBlog} variant="primary"/>
                     </div>

                </div>
              
                <div>
                    <CustomTable columns={column} data={data.blogs}/>
                </div>
            </div>
        </OptionsContainer>
    </div>
}

export default Blogs