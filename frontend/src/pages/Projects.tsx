import LoginBar from "../components/Home/LoginBar";
import Button from "../components/UI/Button";
import CustomTable from "../components/UI/CustomTable";
import OptionsContainer from "../components/UI/OptionsContainer";



const Projects: React.FC = () => {
    const columns = [
        { key: "Name", label: "name" },
        { key: "Description", label: "description" },
        { key: "Status", label: "status" },
        { key: "Created Date", label: "createdDate" },
    ];
    const data = [
        {
            name: "Website Redesign",
            description: "Redesign the corporate website for better UX.",
            status: "In Progress",
            createdDate: "2026-01-15",
        },
        {
            name: "Mobile App",
            description: "Develop a cross-platform mobile application.",
            status: "Planned",
            createdDate: "2026-03-02",
        },
        {
            name: "Data Migration",
            description: "Migrate legacy data to new DB.",
            status: "Completed",
            createdDate: "2025-11-20",
        },
    ];

    return <div>
        <OptionsContainer>
            <LoginBar/>
            <div className="p-6" >
                <div className="flex flex-row justify-between">
                    <div>
                         <h1 className="text-3xl font-bold">Projects</h1>
                         <p className="text-gray-600">Manage your projects here.</p>
                    </div>
                    <div>
                    <Button text="Create New Project + " onClick={()=>{}} variant="primary"/>

                    </div>
                </div>
                <div>
                            <CustomTable columns={columns} data={data} />
                </div>
            </div>
        </OptionsContainer>
    </div>;
}

export default Projects;