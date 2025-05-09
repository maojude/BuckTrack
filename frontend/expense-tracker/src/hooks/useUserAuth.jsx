import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

// to fetch and manage logged in user's data when app loads or refreshes
export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in, no need to fetch user info again
        // This is useful when app is refreshed or reloaded where userContext is lost
        // and we need to fetch user info again to get the user data
        if(user) return;

        let isMounted = true;
        //safety net

        const fetchUserInfo = async () => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                
                // If component is still mounted (user did not switch page) update user context
                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                // When refreshed, then login/token has expired, so clear user data and redirect to login page
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [updateUser, clearUser, navigate]);
};