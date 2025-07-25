"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Eye, Pencil, Trash2, Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const dummyUsers = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "a@gmail.com",
    role: "User",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Tran Thi B",
    email: "b@gmail.com",
    role: "Admin",
    status: "banned",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBan = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "banned" ? "active" : "banned",
            }
          : user
      )
    );
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f7fafd] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header đẹp hơn */}
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
            </Button></Link>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="p-4 shadow-sm border hover:shadow-md transition rounded-2xl bg-white"
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={user.avatar}
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
                        user.status === "banned"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {user.status === "banned"
                        ? "🚫 Đã bị cấm"
                        : "✅ Hoạt động"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <IconButton title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </IconButton>
                  <Link href="/list/users/edituser">
                  <IconButton title="Chỉnh sửa">
                    <Pencil className="w-4 h-4" />
               
                  </IconButton>
                       </Link>
                  <IconButton
                    title="Xóa người dùng"
                    onClick={() => handleDelete(user.id)}
                    className="hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    title={
                      user.status === "banned" ? "Gỡ cấm" : "Cấm người dùng"
                    }
                    onClick={() => handleBan(user.id)}
                    className={
                      user.status === "banned"
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
      </div>
    </main>
  );
}

// Button tròn gọn cho action
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
