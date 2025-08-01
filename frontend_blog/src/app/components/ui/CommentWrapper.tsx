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
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUserId(decoded.id);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  return <CommentForm postId={postId} userId={userId} />;
}
