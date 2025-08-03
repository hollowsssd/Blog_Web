"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  id?: string;
  email: string;
  name: string;
  password: string;
  admin: boolean;
  avatar: string | null;
  banned: boolean;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = use(params);
  const router = useRouter();
  const cookies = new Cookies();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    admin: false,
    avatar: null,
    banned: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = cookies.get("token"); //Get token from cookie
        const res = await axios.get(`http://localhost:8080/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          toast.error("Không có quyền truy cập! (401)", { position: "top-right" });
          router.push("/login");
        } else {
          toast.error("Không thể tải dữ liệu người dùng!", { position: "top-right" });
        }
      }
    };

    if (userId) fetchUser();
  }, [userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "banned"
          ? value === "true"
          : name === "admin"
          ? value === "1" || value === "true"
          : value,
    }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password === "" || password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Email không hợp lệ", { position: "top-right" });
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự hoặc để trống nếu không đổi", {
        position: "top-right",
      });
      return;
    }

    try {
      const token = cookies.get("token"); //Get token from cookie
      await axios.put(`http://localhost:8080/api/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cập nhật người dùng thành công!", { position: "top-right" });
      setTimeout(() => {
        router.push("/list/users");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật người dùng!", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      {/* ... JSX unchanged ... */}
      <ToastContainer />
    </>
  );
}
