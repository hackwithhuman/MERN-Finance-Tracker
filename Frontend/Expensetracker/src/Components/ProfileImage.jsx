import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash2 } from "react-icons/lu";

const ProfileImage = ({ image, setImage }) => {
  const inputRef = useRef();
  const [previewURL, setPreviewURL] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewURL("");
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleChooseImage = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Profile Image or Placeholder */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 border-4 border-purple-500 flex items-center justify-center cursor-pointer hover:bg-purple-50 transition-all relative"
        onClick={handleChooseImage}
        
      >
        {previewURL ? (
          <img
            src={previewURL}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
          
        ) : (
          <LuUser size={40} className="text-purple-400" />
        )}
      </div>

      {/* Upload or Trash Button */}
      {previewURL ? (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white absolute bottom-0 right-32 hover:bg-red-600 transition-all"
        >
          <LuTrash2 size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleChooseImage}
          className="mt-3 flex items-center justify-center text-sm absolute bottom-0 right-36 cursor-pointer text-white w-10 h-10 rounded-full bg-purple-400 hover:text-purple-300 transition-all"
        >
          <LuUpload size={18} /> 
        </button>
      )}
    </div>
  );
};

export default ProfileImage;
