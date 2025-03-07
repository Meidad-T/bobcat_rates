import Link from 'next/link'

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-txst-maroon">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-white py-3 font-outfit">Bobcat Rates</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/"
            className="text-txst-maroon hover:text-txst-maroon/80 transition-colors duration-200 font-medium
                     flex items-center gap-2 text-lg"
          >
            <span className="text-xl">←</span> Back to Search
          </Link>
        </nav>

        {/* Search Results Header */}
        <div className="mb-8 pb-6 border-b">
          <h2 className="text-4xl font-bold text-rmp-text mb-3">
            Search Results
          </h2>
          <p className="text-gray-600 text-lg">
            Showing professors for <span className="font-semibold text-txst-maroon">CS 1428</span>
          </p>
        </div>

        {/* Results Grid - To be implemented */}
        <div className="grid gap-6">
          {/* Placeholder for professor cards */}
          <div className="p-8 rounded-xl bg-rmp-gray shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-center text-gray-500 text-lg">
              Professor results will be displayed here
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-rmp-gray py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-lg">© 2024 Bobcat Rates. Made with ❤️ for TXST students.</p>
        </div>
      </footer>
    </main>
  )
} 