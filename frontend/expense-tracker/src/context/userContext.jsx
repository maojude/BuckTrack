import React, { createContext, useState } from "react";

//Basically to make the functions and variables be available across all components as everything 
// in App is wrapped by UserProvider
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Function to clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            { children }

        </UserContext.Provider>
    );

}

export default UserProvider;