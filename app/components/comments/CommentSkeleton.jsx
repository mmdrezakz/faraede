'use client';

import { Spinner } from '@heroui/spinner';

export default function CommentSkeleton() {
  return (
    <div className="flex justify-center py-10">
      <div className="text-center">
        <Spinner 
          classNames={{
            circle1: "text-gray-400",
            circle2: "text-orange-500",
            wrapper: "text-[#001122]"
          }}
          variant='simple' 
          size='lg' 
        />
        <p className='text-white text-xl text-center'>در حال بارگذاری ...</p> 
      </div>
    </div>
  );
}