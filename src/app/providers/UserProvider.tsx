"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import client from "../../lib/apolloClientCookies"; // Import Apollo Client
import Cookies from "js-cookie";

const VIEWER_QUERY = gql`
  query {
    viewer {
      userId
      id
      username
      email
      firstName
      lastName
    }
  }
`;

// Define context type
interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
}

// Default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get("refreshToken"); // Read token from cookies

  const { data, loading } = useQuery(VIEWER_QUERY, {
    client, // Use custom Apollo client
    skip: !token, // Only run query if token exists
  });

  const user = data?.viewer || null;
  const isAuthenticated = !!user; // True if user exists

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access authentication state
export const useAuth = () => useContext(AuthContext);
