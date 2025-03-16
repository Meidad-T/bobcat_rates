'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { UserCircle, Heart, ThumbsUp, ThumbsDown, Star, SignOut, CaretDown } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface RatingHistory {
  professorName: string;
  courseId: string;
  rating: 'loved' | 'liked' | 'hated';
  timestamp: Date;
}

export default function ProfileContent() {
  const { user, signOut } = useAuth();
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

  useEffect(() => {
    async function fetchRatingHistory() {
      if (!user) return;
      
      try {
        const userRatingsRef = collection(db, 'users', user.uid, 'ratings');
        const ratingsSnapshot = await getDocs(userRatingsRef);
        
        const history: RatingHistory[] = ratingsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            professorName: data.professorName.replace(/_/g, ' '),
            courseId: data.courseId.replace(/_/g, ' '),
            rating: data.rating,
            timestamp: data.timestamp.toDate(),
          };
        });

        history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setRatingHistory(history);
      } catch (error) {
        console.error('Error fetching rating history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatingHistory();
  }, [user]);

  const getRatingInfo = (rating: string) => {
    const size = 24;
    const weight = "fill";
    
    switch (rating) {
      case 'loved':
        return {
          icon: <Heart size={size} weight={weight} className="text-amber-500" />,
          text: 'LOVED',
          textColor: 'text-amber-500'
        };
      case 'liked':
        return {
          icon: <ThumbsUp size={size} weight={weight} className="text-green-500" />,
          text: 'LIKED',
          textColor: 'text-green-500'
        };
      case 'hated':
        return {
          icon: <ThumbsDown size={size} weight={weight} className="text-red-500" />,
          text: 'HATED',
          textColor: 'text-red-500'
        };
      default:
        return {
          icon: null,
          text: '',
          textColor: ''
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please sign in to view your profile</h1>
            <Link 
              href="/"
              className="mt-4 inline-block px-6 py-3 bg-txst-maroon text-white rounded-lg hover:bg-txst-maroon/90"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Profile Header - Premium Design */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-txst-maroon/5 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-start gap-8">
            <div className="relative">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-2xl shadow-lg"
                />
              ) : (
                <UserCircle size={120} className="text-gray-400" weight="fill" />
              )}
              {user.isAdmin && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg">
                    <Star size={20} weight="fill" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
                  {user.isAdmin && (
                    <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium shadow-sm">
                      Admin
                    </div>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <SignOut size={18} weight="bold" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
              <div className="text-lg text-gray-600 mb-2">{user.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star size={16} weight="fill" className="text-amber-500" />
                <span>
                  {user.isAdmin 
                    ? "Unlimited ratings (Admin)" 
                    : `${user.dailyRatingsLeft} ratings remaining today`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating History - Modern Card Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <button 
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="w-full flex items-center justify-between mb-6 group"
        >
          <h2 className="text-2xl font-bold text-gray-900">Rating History</h2>
          <CaretDown 
            size={24} 
            weight="bold" 
            className={`text-gray-400 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''} group-hover:text-gray-600`}
          />
        </button>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isHistoryExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-txst-maroon border-t-transparent mx-auto"></div>
              <div className="mt-4 text-lg text-gray-600">Loading your rating history...</div>
            </div>
          ) : ratingHistory.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Ratings Yet</h3>
              <p className="text-gray-600">Start rating your professors to build your history!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ratingHistory.map((rating, index) => {
                return (
                  <div 
                    key={index}
                    className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-lg">{rating.professorName}</h3>
                      <p className="text-gray-600">{rating.courseId}</p>
                      <p className={`font-medium ${
                        rating.rating === 'loved' ? 'text-amber-500' :
                        rating.rating === 'liked' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {rating.rating.charAt(0).toUpperCase() + rating.rating.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(rating.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 