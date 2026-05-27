'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDate } from './utils';

export default function CommentReplies({ replies }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="space-y-3 xs:space-y-4 mt-4 xs:mt-6">
      {replies.map((reply) => (
        <div key={reply.id} className="bg-gray-50 dark:bg-gray-900/50 p-3 xs:p-4 border-blue-300 dark:border-blue-800 border-r-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-8 h-8">
              <Image
                src={reply.author?.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.pngs'}
                alt={reply.author?.name || 'کاربر'}
                fill
                sizes="32px"
                className="rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                  {reply.author?.name || 'کاربر'}
                </h5>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {formatDate(reply.createdAt)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{reply.content}</p>
        </div>
      ))}
    </div>
  );
}