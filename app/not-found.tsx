import Link from 'next/link'

export const metadata = {
  title: '404 - Page Not Found | Hand To Mouse',
  description: 'This page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>

        <h2
          className="text-2xl md:text-3xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Page Not Found
        </h2>

        <p
          className="text-lg mb-8 text-gray-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          This page doesn't exist or has been moved. The site has been redesigned with a fresh new look.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            ← Back to Home
          </Link>

          <Link
            href="/services"
            className="px-8 py-4 border-2 border-gray-700 hover:border-white transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            View Services
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            Looking for something specific? <Link href="/about" className="underline hover:text-white transition-colors">Get in touch</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
