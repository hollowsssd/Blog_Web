"use client";

import LikeButton from "@/app/components/ui/LikeButton";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

type JwtPayload = {
  id: number;
  name: string;
  email: string;
  exp: number;
};

export default function LikeWrapper({ postId }: { postId: number }) {
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
          setUserId(null);
        }
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUserId(null);
      }
    } else {
      setUserId(null); // Explicitly null if no token
    }
  }, []);

  return <LikeButton postId={postId} userId={userId} />;
}
