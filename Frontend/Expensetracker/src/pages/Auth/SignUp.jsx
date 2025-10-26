import { useState, useContext } from 'react';
import React from 'react';
import Input from '../../Components/input';
import Login from './Login';
import { validateEmail } from '../../Utils/helper';
import toast from 'react-hot-toast';
import ProfileImage from '../../Components/ProfileImage';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContaxt';
import {motion} from "framer-motion"
import uploadImage from '../../Utils/uploadImage'; // ✅ import added

const SignUp = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  if (!userCtx) {
    console.error("UserContext is not provided.");
    return null;
  }

  const { updateUser } = userCtx;

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name) return setError('*Full Name is required');
  if (!email) return setError('*Email is required');
  if (!password || password.length < 6)
    return setError('*Password must be at least 6 characters');
  if (!validateEmail(email)) return setError('*Please enter a valid email address');

  setError('');

  try {
   const formData = new FormData();
formData.append("fullName", name);
formData.append("email", email);
formData.append("password", password);
if (image) formData.append("image", image);  // field name 'image'

 const response = await axiosInstance.post("/api/auth/register", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});


    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/dashboard");
      toast.success("Signup Successful");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error(error);
      setError("Something went wrong");
      toast.error("Please Check your Internet Connection");
    }
  }
};


  if (showLogin) return <motion.div
    initial={{ x: '-20%', opacity: 0 }}       // 👈 Start off-screen to the right
    animate={{ x: 0, opacity: 1 }}            // 👈 Slide to center and fade in
    exit={{ x: '100%', opacity: 0 }}         // 👈 Optional: slide out to left
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <Login />
  </motion.div>;
  

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div>
        <h2 className="text-3xl font-semibold text-center mb-6 text-white tracking-wide">Sign Up</h2>
        <p className="text-gray-300 text-center">Create your account to get started</p>
        <form className="mt-6" onSubmit={handleSubmit}>
          <ProfileImage image={image} setImage={setImage} />
          <Input
            type="text"
            placeholder="Full Name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="you@example.com"
            label="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="••••••••"
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full bg-purple-600/80 hover:bg-purple-700/90 text-white py-2 rounded-lg font-medium focus:ring-4 focus:ring-purple-400 transition-all"
          >
            Create Account
          </button>
        </form>
        <p className="text-gray-300 text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => setShowLogin(!showLogin)}
            className="text-purple-500 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;