import { useState } from "react";
import LoginBar from "../components/Home/LoginBar";
import Button from "../components/UI/Button";
import CustomTable from "../components/UI/CustomTable";
import Modal from "../components/UI/Modal";
import OptionsContainer from "../components/UI/OptionsContainer";
import CustomInput from "../components/Login/CustomInput";
import CustomRadio from "../components/UI/CustomRadio";
import CustomTextarea from "../components/UI/CustomTextarea";

const visibilityOptions = [
    { id: 1, value: "public", label: "Public" },
    { id: 2, value: "private", label: "Private" },
];

const activeOptions = [
    { id: 1, value: "false", label: "Active" },
    { id: 2, value: "true", label: "Inactive" },
];

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

    const [isOpen, setIsOpen] = useState(false);

    // input states 
    const [projectName, setProjectName] = useState("");
    const [projectSummary, setProjectSummary] = useState("");
    const [visibility, setVisibility] = useState(visibilityOptions[0].value);
    const [active, setActive] = useState(activeOptions[0].value);

    return <div>
        <OptionsContainer>
           
            <div className="p-6" >
                <div className="flex flex-row justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Project Management
            </h1>
            <p className="text-sm text-gray-500">
              Record, edit, and manage your projects.
            </p>
                    </div>
                    <div>
                        <Button text="Create New Project + " onClick={() => { setIsOpen(true) }} variant="primary" />

                    </div>
                </div>
                <div>
                    <CustomTable columns={columns} data={data} />
                </div>
            </div>
        </OptionsContainer>

    
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Project" description="" size="sm">
            <div className="flex gap-3 ">
                <form className="w-full">
                    <CustomInput label="Project Name" placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    <CustomTextarea label="Summary" placeholder="Enter project summary" value={projectSummary} onChange={(e) => setProjectSummary(e)} />
                    <CustomRadio options={visibilityOptions} value={visibilityOptions.find(option => option.value === visibility) || null} onChange={(option) => setVisibility(option.value)} label="Visibility" orientation="horizontal" variant="card" />
                    <CustomRadio options={activeOptions} value={activeOptions.find(option => option.value === active) || null} onChange={(option) => setActive(option.value)} label="Active" orientation="horizontal" variant="card" />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" text="Cancel" onClick={() => setIsOpen(false)} />
                        <Button variant="primary" text="Create Project" onClick={() => setIsOpen(false)} />
                    </div>
                </form>
            </div>
        </Modal>


    </div>;
}

export default Projects;