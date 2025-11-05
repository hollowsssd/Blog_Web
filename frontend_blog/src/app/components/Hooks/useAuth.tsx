// hooks/useAuth.ts
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  exp: number;
}

export default function useAuth() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Extract token from cookies
  const getTokenFromCookie = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const c = cookies[i].trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }
    return null;
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
          setUserName(decoded.name);
        } else {
          document.cookie = "token=; Max-Age=0; path=/;";
        }
      } catch {
        console.error("Invalid token");
        document.cookie = "token=; Max-Age=0; path=/;";
      }
    }
  }, []);

  return { 
    userId, 
    userName, 
    token: getTokenFromCookie(),
    isLoggedIn: userId !== null 
  };
}