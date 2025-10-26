import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dashboardUpdated, setDashboardUpdated] = useState(0);

  const triggerDashboardUpdate = () => setDashboardUpdated(prev => prev + 1);

  const updateUser = (userdata) => setUser(userdata);
  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, updateUser, logoutUser, dashboardUpdated, triggerDashboardUpdate }}>
      {children}
    </UserContext.Provider>
  );
};
