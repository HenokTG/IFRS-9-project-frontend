import React, { useState, useContext } from 'react';

const myContext = React.createContext();

export const useGlobalContext = () => {
  return useContext(myContext);
};

export default function AppProvider({ children }) {
  const [profilePk, setProfilePk] = useState('*');
  const [profile, setProfile] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [searchClosed, isSearchClosed] = useState(false);
  const [bankName, setBankName] = useState('Native Analytica Inc.');

  return (
    <myContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        profilePk,
        setProfilePk,
        bankName,
        setBankName,
        profile,
        setProfile,
        loading,
        setLoading,
        summary,
        setSummary,
        searchClosed,
        isSearchClosed,
      }}
    >
      {children}
    </myContext.Provider>
  );
}
