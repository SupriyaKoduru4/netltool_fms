import Navbar from "../Home/Navbar";

const OptionsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-2">
      <Navbar title="Founder Management System"/>
        </div>
      <div className="border-2 border-black col-span-10 h-screen overflow-y-auto">
        
        {children}
      </div>
    </div>
  );
};

export default OptionsContainer;