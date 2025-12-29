'use client';
import React from 'react';

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
}