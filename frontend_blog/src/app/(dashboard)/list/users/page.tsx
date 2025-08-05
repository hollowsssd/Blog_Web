"use client";

import axios, { AxiosError } from "axios";
import { Ban, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import Cookies from 'universal-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  banned: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Load token 1 lần duy nhất
  useEffect(() => {
    const cookies = new Cookies();
    const storedToken = cookies.get("token");

    if (!storedToken) {
      toast.error("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }

    setToken(storedToken);
  }, []);

  const fetchUsers = async (keyword?: string) => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const url = keyword
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api/user/search?name=${keyword}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api/user`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setUsers(res.data);
        if (keyword && res.data.length === 0) {
          toast.info("Không tìm thấy người dùng nào.");
        }
      } else {
        setUsers([]);
        toast.warn("Dữ liệu trả về không hợp lệ.");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
      } else {
        toast.error("Không thể tải danh sách người dùng.");
      }
      setError("Lỗi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (token) {
        search.trim() ? fetchUsers(search.trim()) : fetchUsers();
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search, token]);

  const handleBanToggle = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user || !token) return;

    try {
      const url = user.banned
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api/user/unban/${userId}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api/user/ban/${userId}`;

      const res = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Cập nhật trạng thái thành công!");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, banned: !u.banned } : u))
      );
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái người dùng.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("🗑️ Đã xoá người dùng.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      toast.error("Xảy ra lỗi khi xoá người dùng.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] px-6 py-10">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📋 Quản lý người dùng
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              placeholder="🔍 Tìm kiếm người dùng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full w-full sm:w-64"
            />
            <Link href="/list/users/createuser">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6">
                + Thêm người dùng
              </Button>
            </Link>
          </div>
        </header>

        {loading ? (
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card
                key={user.id}
                className="p-4 border rounded-2xl shadow hover:shadow-md bg-white transition"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={user.avatar || "/images/avatar.png"}
                      alt={user.name || "avatar người dùng"}
                      width={48}
                      height={48}
                      className="rounded-full border object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p
                        className={`text-sm font-medium ${
                          user.banned ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {user.banned ? "🚫 Bị cấm" : "✅ Đang hoạt động"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    {/* <IconButton title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </IconButton> */}
                    <Link href={`/list/users/${user.id}`}>
                      <IconButton title="Chỉnh sửa">
                        <Pencil className="w-4 h-4" />
                      </IconButton>
                    </Link>
                    <IconButton
                      title="Xoá người dùng"
                      onClick={() => handleDelete(user.id)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      title={user.banned ? "Gỡ cấm" : "Cấm"}
                      onClick={() => handleBanToggle(user.id)}
                      className={
                        user.banned
                          ? "hover:text-green-600"
                          : "hover:text-red-600"
                      }
                    >
                      <Ban className="w-4 h-4" />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function IconButton({
  children,
  title,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition ${className}`}
    >
      {children}
    </button>
  );
}
