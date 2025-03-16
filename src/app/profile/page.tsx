'use client';

import ProfileContent from '@/components/ProfileContent';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <div className="bg-txst-maroon">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-white font-outfit">
              Bobcat Rates
            </Link>
          </div>
        </div>
      </div>

      <ProfileContent />
    </div>
  );
} 