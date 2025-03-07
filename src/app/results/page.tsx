'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProfessorsForCourse, Professor } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

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
    <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl mx-auto">
      <input
        type="text"
        name="prefix"
        defaultValue={defaultPrefix}
        placeholder="Course Prefix"
        className="w-1/3 px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 
                   text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
        required
        pattern="[A-Za-z]+"
      />
      <input
        type="text"
        name="number"
        defaultValue={defaultNumber}
        placeholder="Course Number"
        className="w-2/3 px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 
                   text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
        required
        pattern="[0-9]+"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 
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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-3xl font-bold text-white font-outfit">
                Bobcat Rates
              </Link>
              <SearchBar defaultPrefix={prefix} defaultNumber={number} />
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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-3xl font-bold text-white font-outfit">
                Bobcat Rates
              </Link>
              <SearchBar defaultPrefix={prefix} defaultNumber={number} />
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-txst-maroon">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-white font-outfit">
              Bobcat Rates
            </Link>
            <SearchBar defaultPrefix={prefix} defaultNumber={number} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
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

            <div className="grid gap-6">
              {professors.map((professor, index) => {
                const ratings = professor.ratings[courseId] || { loved: 0, liked: 0, hated: 0 };
                const total = ratings.loved + ratings.liked + ratings.hated;
                
                return (
                  <div 
                    key={professor.name}
                    className="bg-white rounded-xl shadow-lg overflow-hidden flex"
                  >
                    {/* Rank Number */}
                    <div className="bg-txst-maroon w-24 flex-shrink-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">#{index + 1}</span>
                    </div>

                    {/* Professor Info */}
                    <div className="flex-grow p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {professor.name}
                      </h2>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {ratings.loved}
                          </div>
                          <div className="text-sm text-gray-600">Loved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {ratings.liked}
                          </div>
                          <div className="text-sm text-gray-600">Liked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {ratings.hated}
                          </div>
                          <div className="text-sm text-gray-600">Hated</div>
                        </div>
                      </div>

                      {total > 0 && (
                        <div className="mt-4 bg-gray-100 rounded-lg overflow-hidden">
                          <div className="flex h-2">
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${(ratings.loved / total) * 100}%` }}
                            />
                            <div 
                              className="bg-blue-500" 
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