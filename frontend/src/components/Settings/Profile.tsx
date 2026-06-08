import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button";
import CustomInput from "../../components/Login/CustomInput";
// @ts-ignore
import CameraIcon from "../../assets/camera.svg";

import { useAppData } from "../../context/AppDate";
import { useUpdateUserProfileMutation } from "../../services/api/userSlice";

const BASE_URL = (import.meta as any).env.VITE_BASE_URL;

function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phoneNumber: "",
  });

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
  });

  const { user } = useAppData();

  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const avatarSrc = image
    ? image
    : user?.avatar_url
    ? `${BASE_URL}${user.avatar_url}`
    : null;

  const initials = user
    ? `${(user.first_name?.[0] || "").toUpperCase()}${(user.last_name?.[0] || "").toUpperCase()}`
    : "?";

  useEffect(() => {
    if (user) {
      const initial = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      };
      setFormData({
        ...initial,
        email: user.email || "",
        role: user.role?.name || "",
        phoneNumber: user.phone || user.phone_number || "",
      });
      setOriginalData(initial);
    }
  }, [user]);

  // Dirty check: true if anything editable has changed from original
  const isDirty =
    formData.firstName.trim() !== originalData.firstName.trim() ||
    formData.lastName.trim() !== originalData.lastName.trim() ||
    image !== "";

  const openGallery = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const Camera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      alert("Camera Opened Successfully");
      setShowOptions(false);
    } catch (error) {
      console.log(error);
    }
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (!isDirty) return;
    try {
      const newFormData = new FormData();
      newFormData.append("first_name", formData.firstName);
      newFormData.append("last_name", formData.lastName);
      if (image) {
        const profile_image = fileInputRef.current?.files?.[0];
        if (profile_image) {
          newFormData.append("profile_image", profile_image);
        }
      }
      await updateProfile({ body: newFormData }).unwrap();
      // After successful save, reset the baseline so button disables again
      setOriginalData({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setImage("");
    } catch (err) {
      console.log("Error updating profile: ", err);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">

      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Profile Settings</h2>
        <p className="text-sm text-gray-400">Manage your personal information</p>

        {/* Avatar */}
        <div className="relative mt-5">
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer bg-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-gray-500 select-none">
                {initials}
              </span>
            )}
          </div>

          {/* Camera badge */}
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white hover:bg-blue-600 transition-colors"
          >
            <img src={CameraIcon} alt="camera" className="w-3.5 h-3.5 brightness-0 invert" />
          </div>

          {/* Options dropdown */}
          {showOptions && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl w-[200px] overflow-hidden z-50">
              <button
                onClick={Camera}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <img src={CameraIcon} alt="camera" className="w-4 h-4 opacity-60" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={openGallery}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Choose from Gallery</span>
              </button>
            </div>
          )}
        </div>

        {/* Name + Role badge */}
        {user && (
          <div className="flex flex-col items-center mt-3 gap-1">
            <p className="font-semibold text-gray-800 text-base capitalize">
              {user.first_name} {user.last_name}
            </p>
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full border border-blue-100">
              {user.role?.name}
            </span>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">Click the avatar to update your photo</p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImage}
          hidden
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-1">
        <CustomInput
          name="firstName"
          label="First Name"
          placeholder=""
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <CustomInput
          name="lastName"
          label="Last Name"
          placeholder=""
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <CustomInput
          name="email"
          label="Email Address"
          placeholder=""
          value={formData.email}
          onChange={handleInputChange}
          disabled
        />
        <CustomInput
          name="role"
          label="Role"
          placeholder=""
          value={formData.role}
          onChange={handleInputChange}
          disabled
        />
        <CustomInput
          name="phoneNumber"
          label="Phone Number"
          placeholder=""
          value={formData.phoneNumber}
          onChange={handleInputChange}
          disabled
        />
      </div>

      {/* Save */}
      <div className="flex justify-end mt-6">
        <Button
          isLoading={isLoading}
          disabled={!isDirty || isLoading}
          text="Save Changes"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ProfileSettings;