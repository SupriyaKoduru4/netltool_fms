const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => {
  return (
    <button
      className={`p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 ${className || ''}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default IconButton;