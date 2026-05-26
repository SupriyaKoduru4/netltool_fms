import React from "react";

interface CustomInputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}) => {

  return (

    <div className="w-full flex flex-col gap-1">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className=" flex items-center border border-gray-300 rounded-md bg-white overflow-hidden " >

        {icon && (

          <div className="px-3">
            <img
              src={icon}
              alt="icon"
              className="w-5 h-5 opacity-75"
            />
          </div>
        )}

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="  w-full px-3 py-3 outline-none text-sm bg-white selection:bg-transparent selection:text-black"/>

      </div>
    </div>
  );
};

export default CustomInput;