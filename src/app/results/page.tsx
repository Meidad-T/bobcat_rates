'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProfessorsForCourse, Professor } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { LoginButton } from '@/components/LoginButton';
import { useAuth } from '@/lib/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

function RatingKey() {
  return (
    <div className="flex gap-8 justify-center mb-8 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-amber-500 rounded"></div>
        <span className="text-gray-600">Loved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <span className="text-gray-600">Liked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500 rounded"></div>
        <span className="text-gray-600">Disliked</span>
      </div>
    </div>
  );
}

function RatingButton({ 
  type, 
  count, 
  isActive, 
  onClick 
}: { 
  type: 'love' | 'like' | 'hate';
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const getIcon = () => {
    const size = 44;
    const weight = isActive ? "fill" : "regular";
    const color = isActive 
      ? type === 'love' 
        ? '#f59e0b' 
        : type === 'like' 
          ? '#22c55e' 
          : '#ef4444'
      : '#9ca3af';

    switch (type) {
      case 'love':
        return <Heart size={size} weight={weight} color={color} />;
      case 'like':
        return <ThumbsUp size={size} weight={weight} color={color} />;
      case 'hate':
        return <ThumbsDown size={size} weight={weight} color={color} />;
    }
  };

  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 transition-transform hover:scale-110"
    >
      {getIcon()}
      <span className="text-lg font-medium text-gray-600">{count}</span>
    </button>
  );
}

function SearchBar({ defaultPrefix = '', defaultNumber = '' }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prefix = formData.get('prefix') as string;
    const number = formData.get('number') as string;
    router.push(`/results?prefix=${prefix}&number=${number}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-[500px]">
      <input
        type="text"
        name="prefix"
        defaultValue={defaultPrefix}
        placeholder="Course Prefix"
        className="w-1/3 px-3 py-2 rounded-lg border-2 border-white/20 bg-white/10 
                   text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
        required
        pattern="[A-Za-z]+"
      />
      <input
        type="text"
        name="number"
        defaultValue={defaultNumber}
        placeholder="Course Number"
        className="w-2/3 px-3 py-2 rounded-lg border-2 border-white/20 bg-white/10 
                   text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
        required
        pattern="[0-9]+"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 
                   transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRatings, setActiveRatings] = useState<{[key: string]: 'love' | 'like' | 'hate' | null}>({});
  const { user } = useAuth();

  const prefix = searchParams.get('prefix')?.toUpperCase() || '';
  const number = searchParams.get('number') || '';
  const courseId = `${prefix}_${number}`;

  useEffect(() => {
    async function fetchProfessors() {
      try {
        if (!prefix || !number) {
          setError('Please provide both course prefix and number');
          setLoading(false);
          return;
        }

        const results = await getProfessorsForCourse(prefix, number);
        setProfessors(results);
        setLoading(false);
      } catch (err) {
        setError('Error fetching professors');
        setLoading(false);
      }
    }

    fetchProfessors();
  }, [prefix, number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="bg-txst-maroon">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center h-16 px-0">
              {/* Left: Bobcat Rates text - completely flush left */}
              <Link href="/" className="text-2xl font-bold text-white font-outfit ml-0">
                Bobcat Rates
              </Link>

              {/* Center: Search Bar */}
              <div className="flex-1 flex justify-center">
                <SearchBar defaultPrefix={prefix} defaultNumber={number} />
              </div>

              {/* Right: Login Button */}
              <div>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse text-2xl text-gray-600">Loading professors...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="bg-txst-maroon">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center h-16 px-0">
              {/* Left: Bobcat Rates text - completely flush left */}
              <Link href="/" className="text-2xl font-bold text-white font-outfit ml-0">
                Bobcat Rates
              </Link>

              {/* Center: Search Bar */}
              <div className="flex-1 flex justify-center">
                <SearchBar defaultPrefix={prefix} defaultNumber={number} />
              </div>

              {/* Right: Login Button */}
              <div>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-2xl text-red-600 mb-4">{error}</div>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-txst-maroon text-white rounded-lg hover:bg-txst-maroon/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRating = async (professor: Professor, type: 'love' | 'like' | 'hate') => {
    // 1. Check if user is logged in
    if (!user) {
      toast.error('Please sign in to rate professors');
      return;
    }

    // 2. Check if user has ratings left
    if (user.dailyRatingsLeft <= 0) {
      toast.error('You have used all your ratings for today');
      return;
    }

    try {
      // Debug logging
      console.log('Rating professor:', {
        name: professor.name,
        id: professor.id,
        courseId: courseId
      });
      
      // Use the professor's document reference directly
      const professorRef = doc(db, 'Schools', 'texas_state_university', 'Professors', professor.id);
      const userRef = doc(db, 'users', user.uid);
      console.log('Attempting to access document:', professorRef.path);

      // Update both documents atomically
      await runTransaction(db, async (transaction) => {
        // Get current data
        const professorDoc = await transaction.get(professorRef);
        console.log('Professor doc exists:', professorDoc.exists(), 'Data:', professorDoc.data());
        const userDoc = await transaction.get(userRef);
        console.log('User doc exists:', userDoc.exists(), 'Data:', userDoc.data());

        if (!professorDoc.exists()) {
          throw new Error(`Professor ${professor.name} not found in database`);
        }

        // Get current ratings or initialize if not exists
        const professorData = professorDoc.data();
        const ratings = professorData.ratings || {};
        
        // Initialize course ratings if they don't exist
        if (!ratings[courseId]) {
          ratings[courseId] = { loved: 0, liked: 0, hated: 0 };
        }

        // Update the specific course rating
        ratings[courseId][type + 'd'] = (ratings[courseId][type + 'd'] || 0) + 1;

        console.log('Updating ratings:', {
          courseId,
          type,
          oldRatings: professorData.ratings?.[courseId],
          newRatings: ratings[courseId]
        });

        // Update professor document with new ratings
        transaction.update(professorRef, { ratings });

        // Update user document with new daily ratings and timestamp
        const newDailyRatingsLeft = Math.max(0, (userDoc.data()?.dailyRatingsLeft || 5) - 1);
        transaction.update(userRef, {
          dailyRatingsLeft: newDailyRatingsLeft,
          lastRatingDate: new Date()
        });

        // Return the updated data so we can use it to update the UI
        return {
          newRatings: ratings[courseId],
          newDailyRatingsLeft
        };
      }).then(({ newRatings, newDailyRatingsLeft }) => {
        // Update local state with new ratings
        setProfessors(prevProfessors => 
          prevProfessors.map(p => 
            p.id === professor.id 
              ? { ...p, ratings: { ...p.ratings, [courseId]: newRatings } }
              : p
          )
        );

        // Update active ratings state
        setActiveRatings(prev => ({
          ...prev,
          [professor.id]: type
        }));

        // Update the user's daily ratings in the auth context
        if (user) {
          user.dailyRatingsLeft = newDailyRatingsLeft;
        }

        toast.success('Rating submitted successfully!');
      });

    } catch (error) {
      console.error('Rating error:', error);
      if (error instanceof Error) {
        toast.error(`Rating failed: ${error.message}`);
      } else {
        toast.error('Failed to submit rating. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-txst-maroon">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center h-16 px-0">
            {/* Left: Bobcat Rates text - completely flush left */}
            <Link href="/" className="text-2xl font-bold text-white font-outfit ml-0">
              Bobcat Rates
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center">
              <SearchBar defaultPrefix={prefix} defaultNumber={number} />
            </div>

            {/* Right: Login Button */}
            <div>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {professors.length === 0 ? (
          <div className="text-center mt-24">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-outfit">
              No Results Found
            </h2>
            <div className="relative w-72 h-72 mx-auto mb-10">
              <Image
                src="/no_results_boko.png"
                alt="No Results Found"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="text-2xl text-gray-800 font-medium">
                We couldn't find any professors teaching <span className="text-txst-maroon font-semibold">{courseId.replace('_', ' ')}</span>
              </p>
              <p className="text-lg text-gray-600">
                Please verify the course prefix and number, then try your search again.
              </p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Results for {courseId.replace('_', ' ')}
            </h1>

            <RatingKey />

            <div className="grid gap-6">
              {professors.map((professor, index) => {
                const ratings = professor.ratings[courseId] || { loved: 0, liked: 0, hated: 0 };
                const total = ratings.loved + ratings.liked + ratings.hated;
                const activeRating = activeRatings[professor.id];
                
                return (
                  <div 
                    key={professor.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden flex w-[1040px] h-[160px] mx-auto"
                  >
                    {/* Rank Number */}
                    <div className="bg-txst-maroon w-28 flex-shrink-0 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">#{index + 1}</span>
                    </div>

                    {/* Professor Info */}
                    <div className="flex-grow p-6 flex items-center">
                      <div className="w-[450px]">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 truncate">
                          {professor.name}
                        </h2>
                        {total > 0 && (
                          <div className="bg-gray-100 rounded-lg overflow-hidden w-56">
                            <div className="flex h-2">
                              <div 
                                className="bg-amber-500" 
                                style={{ width: `${(ratings.loved / total) * 100}%` }}
                              />
                              <div 
                                className="bg-green-500" 
                                style={{ width: `${(ratings.liked / total) * 100}%` }}
                              />
                              <div 
                                className="bg-red-500" 
                                style={{ width: `${(ratings.hated / total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vertical Divider */}
                      <div className="w-px h-24 bg-gray-200"></div>

                      {/* Rating Buttons */}
                      <div className="flex-1 flex justify-center gap-8 items-center">
                        <RatingButton 
                          type="love" 
                          count={ratings.loved} 
                          isActive={activeRating === 'love'} 
                          onClick={() => handleRating(professor, 'love')}
                        />
                        <RatingButton 
                          type="like" 
                          count={ratings.liked} 
                          isActive={activeRating === 'like'} 
                          onClick={() => handleRating(professor, 'like')}
                        />
                        <RatingButton 
                          type="hate" 
                          count={ratings.hated} 
                          isActive={activeRating === 'hate'} 
                          onClick={() => handleRating(professor, 'hate')}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}