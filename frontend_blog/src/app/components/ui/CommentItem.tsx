'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl: string;
  };
};

export default function CommentItem({ comment }: { comment: Comment }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300;
  const isLong = comment.content.length > maxLength;

  const displayText = expanded
    ? comment.content
    : comment.content.slice(0, maxLength);

  return (
    <li className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
        {displayText}
        {isLong && !expanded && '...'}
        {isLong && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="ml-2 text-blue-600 text-xs hover:underline"
          >
            {expanded ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
        <Link href={`/profile/${comment.user.id}`} className="flex items-center gap-2 hover:underline">
          <Image
            src={`http://localhost:8080/post/images/${comment.user.avatarUrl}`}
            alt={comment.user.name}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <span>{comment.user.name}</span>
        </Link>
        <span>• {new Date(comment.createdAt).toLocaleString()}</span>
      </div>
    </li>
  );
}
