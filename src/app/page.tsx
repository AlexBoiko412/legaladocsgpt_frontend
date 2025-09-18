'use client';

import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Welcome to My App</h1>
        <div className="space-x-4">
          <Link href="/signup" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign Up
          </Link>
          <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Login
          </Link>
        </div>
      </div>
  );
}