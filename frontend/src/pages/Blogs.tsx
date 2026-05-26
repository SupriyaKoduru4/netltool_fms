import LoginBar from "../components/Home/LoginBar"
import Button from "../components/UI/Button"
import CustomTable from "../components/UI/CustomTable"
import OptionsContainer from "../components/UI/OptionsContainer"

const column = [
    {key: "title", label: "Title"},
    {key: "author", label: "Author"},
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
    return <div>
        <OptionsContainer>
            <LoginBar/>
            <div className="p-6" >
                <div className="flex flex-row justify-between">
                    <div>
                         <h1 className="text-3xl font-bold">Blogs</h1>
                <p>Manage your blog posts here.</p>
                    </div>
                     
                     <div>
                        <Button text="Create New Blog + " onClick={()=>{}} variant="primary"/>
                     </div>

                </div>
              
                <div>
                    <CustomTable columns={column} data={blogData}/>
                </div>
            </div>
        </OptionsContainer>
    </div>
}

export default Blogs