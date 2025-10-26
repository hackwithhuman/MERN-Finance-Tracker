import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";
import { UserContext } from "../Context/UserContaxt";

export const useUserAuth = () => {
  const navigate = useNavigate();
  const { user, updateUser, clearUser } = useContext(UserContext);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token || user) return; // no token or already have user -> do nothing

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
      if (res.data) updateUser(res.data);
    } catch (err) {
      clearUser();
      localStorage.removeItem("token");
      navigate("/login", { replace: true }); // replace avoids history loop
    }
  };

  fetchUser();
}, [user, updateUser, clearUser, navigate]);

};
