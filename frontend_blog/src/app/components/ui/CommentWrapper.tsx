'use client';

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CommentForm from "./CommentForm";

interface JwtPayload {
  id: number;
  name: string;
  email: string;
  exp: number;
}

export default function CommentWrapper({ postId }: { postId: number }) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const getTokenFromCookie = (): string | null => {
      const name = "token=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.startsWith(name)) {
          return c.substring(name.length);
        }
      }
      return null;
    };

    const token = getTokenFromCookie();

    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
        } else {
          document.cookie = "token=; Max-Age=0; path=/;";
          setUserId(null);
        }
      } catch (err) {
        console.error("Invalid token");
        document.cookie = "token=; Max-Age=0; path=/;";
        setUserId(null);
      }
    }
  }, []);

  return <CommentForm postId={postId} userId={userId} />;
}
