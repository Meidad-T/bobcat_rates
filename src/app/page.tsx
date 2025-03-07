import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-txst-maroon">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-white py-3 font-outfit">Bobcat Rates</h1>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative bg-rmp-gray mt-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/BG_oldmain.png"
            alt="Texas State University Old Main Building"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-7xl md:text-8xl font-bold mb-4 text-white drop-shadow-lg font-outfit tracking-tight">
              Bobcat Rates
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-16 text-white/90 drop-shadow">
              Find Your Best TXST Professors
            </h2>
            
            {/* Search Section */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-10 shadow-xl max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <label htmlFor="prefix" className="block text-base font-medium text-gray-700 text-left mb-2">
                    Course Prefix
                  </label>
                  <input
                    id="prefix"
                    type="text"
                    placeholder="e.g., CS"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg text-rmp-text 
                             placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-txst-maroon/20 
                             focus:border-txst-maroon bg-white"
                  />
                </div>
                <div className="md:w-2/3">
                  <label htmlFor="number" className="block text-base font-medium text-gray-700 text-left mb-2">
                    Course Number
                  </label>
                  <input
                    id="number"
                    type="text"
                    placeholder="e.g., 1428, 2308"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg text-rmp-text 
                             placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-txst-maroon/20 
                             focus:border-txst-maroon bg-white"
                  />
                </div>
              </div>
              <Link 
                href="/results"
                className="mt-8 w-full inline-block px-8 py-4 bg-txst-maroon text-white text-lg rounded-lg
                         hover:bg-txst-maroon/90 transition-all duration-200 font-medium
                         transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Search Professors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-rmp-text">
            Why Use Bobcat Rates?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Data-Driven Insights",
                description: "Make informed decisions based on real student experiences and ratings"
              },
              {
                icon: "🎯",
                title: "Course-Specific Ratings",
                description: "Find professors rated specifically for the course you're interested in"
              },
              {
                icon: "⭐",
                title: "Student-First Focus",
                description: "Built by students, for students at Texas State University"
              }
            ].map((feature, index) => (
              <div key={index} 
                   className="text-center p-8 rounded-xl bg-rmp-gray shadow-lg hover:shadow-xl
                            transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-rmp-text">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-rmp-gray py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-lg">© 2024 Bobcat Rates. Made with ❤️ for TXST students.</p>
        </div>
      </footer>
    </main>
  )
} 