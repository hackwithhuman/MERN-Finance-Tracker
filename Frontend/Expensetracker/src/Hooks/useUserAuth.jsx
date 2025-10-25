import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContaxt";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPath";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return; // already logged in

    let mounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
        if (mounted && response.data) {
          updateUser(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        if (mounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      mounted = false;
    };
  // ✅ only run once when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
