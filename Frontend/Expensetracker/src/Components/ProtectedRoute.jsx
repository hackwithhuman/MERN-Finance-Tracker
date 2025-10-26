import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContaxt";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";

const ProtectedRoute = ({ children }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
        if (res.data) {
          updateUser(res.data);
          setIsValid(true);
        }
      } catch (err) {
        localStorage.removeItem("token");
        clearUser();
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Validating session...</p>
      </div>
    );

  if (!isValid) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
