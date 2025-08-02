'use client';

import { useState } from 'react';

// Define the expected shape of a Comment
type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
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
      <div className="text-xs text-gray-500 mt-1">
        {comment.user.name} • {new Date(comment.createdAt).toLocaleString()}
      </div>
    </li>
  );
}
