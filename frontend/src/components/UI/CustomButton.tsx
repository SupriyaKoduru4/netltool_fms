const CustomButton: React.FC<{
  text: string;
  onClick: () => void;
}> = ({ text, onClick }) => {
  return (
    <button
      className="w-full bg-[#0f0f0f] text-white py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-300"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;