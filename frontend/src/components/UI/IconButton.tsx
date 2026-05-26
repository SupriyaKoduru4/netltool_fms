const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ icon, onClick }) => {
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default IconButton;