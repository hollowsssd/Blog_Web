'use client';

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, Pencil, Trash2, Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/user");
      const data = res.data as User[];
      const filtered = data.filter(
        (u) => typeof u.name === "string" && typeof u.email === "string"
      );
      setUsers(filtered);
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBan = async (userId: number) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  try {
    const apiUrl = user.banned
      ? `http://localhost:8080/api/user/unban/${userId}`
      : `http://localhost:8080/api/user/ban/${userId}`;

    const res = await axios.put(apiUrl);

    toast.success(res.data.message || "Cập nhật trạng thái thành công!");

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, banned: !user.banned } : u
      )
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật trạng thái."
      );
    } else {
      toast.error("Lỗi không xác định.");
    }
  }
};

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;

    try {
      const res = await axios.delete(`http://localhost:8080/api/user/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("🗑️ Xoá người dùng thành công!");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Xảy ra lỗi khi xoá.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7fafd] px-6 py-10">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">
              📋 Quản lý người dùng
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              placeholder="🔍 Tìm kiếm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full w-full sm:w-64"
            />
            <Link href="/list/users/createuser">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
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
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="p-4 shadow-sm border hover:shadow-md transition rounded-2xl bg-white"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={user.avatar || "/images/avatar.png"}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p
                        className={`text-sm font-medium ${
                          user.banned
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {user.banned ? "🚫 Đã bị cấm" : "✅ Hoạt động"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <IconButton title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </IconButton>
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
                      title={user.banned ? "Gỡ cấm" : "Cấm người dùng"}
                      onClick={() => handleBan(user.id)}
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
