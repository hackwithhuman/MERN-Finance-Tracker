import React from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi';
const Input = ({onChange, value, placeholder, label ,type}) => {

    const [showpassword , setShowpassword] = React.useState(false);
    const togglePasswordVisibility = () => {
      setShowpassword(!showpassword);
    }

     // if it's a password field, decide the real input type dynamically
  const inputType = type === "password" ? (showpassword ? "text" : "password") : type;
  return (
    <div className="relative mt-8">
      <label className='text-sm text-gray-200'>{label}</label>
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-white/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all "
        

      />
      {type === 'password' && ( 
        <>
          {showpassword ? (
            <HiEyeOff
              className="absolute right-3 top-9 text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <HiEye
              className="absolute right-3 top-9 text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Input