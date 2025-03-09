'use client';

import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { UserCircle, Star } from '@phosphor-icons/react';
import { useState } from 'react';

export function LoginButton() {
  const { user, signIn, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity disabled:opacity-50"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <UserCircle size={32} className="text-white" weight="fill" />
            )}
            <span className="text-sm font-medium">
              {user.displayName || 'User'}
            </span>
          </button>

          {/* Daily Ratings Counter */}
          <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-medium rounded-full px-2 py-1">
            <Star size={12} weight="fill" className="text-white" />
            <span>{user.adminLabel || `${user.dailyRatingsLeft} left`}</span>
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 px-4 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to sign out
        </div>

        {error && (
          <div className="absolute right-0 top-full mt-2 bg-red-100 text-red-600 rounded-lg py-2 px-4 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        <UserCircle size={32} className="text-white" weight="regular" />
        <span className="text-sm font-medium">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </span>
      </button>

      {error && (
        <div className="absolute right-0 top-full mt-2 bg-red-100 text-red-600 rounded-lg py-2 px-4 text-sm whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
} 