
import { useRef, useState } from "react";

import Button from "../UI/Button";

import CustomInput from "../../components/Login/CustomInput";

import CameraIcon from "../../assets/camera.svg";

function ProfileSettings() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const openGallery = () => { fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleImage = ( e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {

      const imageUrl =  URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const Camera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      alert(
        "Camera Opened Successfully"
      );

      setShowOptions(false);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className=" border border-gray-300 rounded-md p-3" >

      <div className=" flex flex-col items-center justify-center mb-6" >
        <h2 className=" text-xl font-bold text-black mb-2 " >
          Profile Information
        </h2>

        <div className="relative">
          <div
            onClick={() => setShowOptions(!showOptions) }
            className=" w-20 h-20 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center cursor-pointer " >

            {image ? (

              <img
                src={image}
                alt="profile"
                className=" w-full h-full object-cover "
              />

            ) : (

              <img
                src={CameraIcon}
                alt="camera"
                className=" w-8 h-8 object-contain
                "
              />
            )}
          </div>

          {showOptions && (

            <div className="  absolute  top-32 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-xl shadow-lg  w-[190px] overflow-hidden z-50" >
              <button
                onClick={Camera} 
                className="w-full flex items-center gap-3 px-2 py-2 transition-all ">

                 <img
                src={CameraIcon}
                alt="camera"
                className=" w-5 h-5 object-contain
                "
              />

                <span>
                  Camera
                </span>

              </button>

              <button
                onClick={openGallery}
                className=" w-full flex items-center gap-3 px-2 py-2 border-t  border-gray-200 transition-all " >

                <span className="text-sm">
                  image
                </span>

                <span>
                  Choose From Gallery
                </span>

              </button>

            </div>

          )}

        </div>

        <p className="text-sm text-gray-400 mt-4">
          Click profile image to upload
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImage}
          hidden
        />

      </div>

    
      <div className="grid grid-cols-1 gap-1">

        <CustomInput
          label="Full Name"
          placeholder=""
        />

        <CustomInput
          label="Email Address"
          placeholder=""
        />

        <CustomInput
          label="Role"
          placeholder=""
        />

        <CustomInput
          label="Phone Number"
          placeholder=""
        />
      </div>

      <div className="flex justify-end mt-5">

        <Button
          text="Save Changes"
          variant="primary"
          onClick={() =>
            alert(
              "Changes Saved Successfully"
            )
          }
        />

      </div>

    </div>
  );
}

export default ProfileSettings;