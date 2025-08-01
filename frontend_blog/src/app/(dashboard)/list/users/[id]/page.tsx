'use client';

import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    admin: false,
    avatar: null,
    banned: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          toast.error('Không có quyền truy cập! (401)', { position: 'top-right' });
          router.push('/login');
        } else {
          toast.error('Không thể tải dữ liệu người dùng!', { position: 'top-right' });
        }
      }
    };

    if (userId) fetchUser();
  }, [userId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'banned'
          ? value === 'true'
          : name === 'admin'
          ? value === '1' || value === 'true'
          : value,
    }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password === '' || password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error('Email không hợp lệ', { position: 'top-right' });
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự hoặc để trống nếu không đổi', {
        position: 'top-right',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/user/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Cập nhật người dùng thành công!', { position: 'top-right' });
      setTimeout(() => {
        router.push('/list/users');
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật người dùng!', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eef4fa] flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Chỉnh sửa Người Dùng
          </h2>

          <div className="relative">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
            >
              Tên người dùng
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-gray-500 text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all"
            >
              Mật khẩu mới (bỏ trống nếu không đổi)
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Vai trò</label>
            <select
              name="admin"
              value={formData.admin ? '1' : '0'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">User</option>
              <option value="1">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Cập nhật người dùng
          </button>
        </form>
      </main>
      <ToastContainer />
    </>
  );
}
