'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
interface Report {
  id: string;
  reportedUser: {
    name: string;
    email: string;
    avatar: string;
  };
  reporter: {
    name: string;
    email: string;
  };
  reason: string;
  createdAt: string;
}

export default function DanhSachBaoCao() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setReports([
      {
        id: '1',
        reportedUser: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          avatar: '/images/avatar.png',
        },
        reporter: {
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
        },
        reason: 'Quấy rối hoặc bắt nạt',
        createdAt: '2025-07-30T10:15:00Z',
      },
      {
        id: '2',
        reportedUser: {
          name: 'Lê Thị C',
          email: 'lethic@example.com',
          avatar: '/images/avatar.png',
        },
        reporter: {
          name: 'Phạm Văn D',
          email: 'phamvand@example.com',
        },
        reason: 'Spam hoặc gây hiểu lầm',
        createdAt: '2025-07-30T11:00:00Z',
      },
    ]);
  }, []);

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
    // Gọi API xóa ở đây nếu cần
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh sách báo cáo</h1>

      <div className="flex overflow-x-auto gap-4 pb-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="min-w-[300px] flex-shrink-0 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-4"
          >
            <div className="flex items-center gap-4 mb-3">
              <Image
                src={report.reportedUser.avatar}
                alt="Người bị báo cáo"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{report.reportedUser.name}</p>
                <p className="text-sm text-gray-500">{report.reportedUser.email}</p>
              </div>
            </div>

            <div className="text-sm text-gray-700">
              <p><strong>Người báo cáo:</strong> {report.reporter.name}</p>
              <p><strong>Lý do:</strong> {report.reason}</p>
              <p className="text-xs text-gray-400 mt-1">
                <strong>Thời gian:</strong> {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => handleDelete(report.id)}
              className="mt-4 w-full text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Xóa báo cáo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
