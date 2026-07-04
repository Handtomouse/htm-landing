import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-black text-white px-6 py-20 flex items-center justify-center">
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
          className="text-lg mb-8 text-[var(--muted)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          This page doesn't exist or has been moved. If you're looking for portfolio or gallery pages, the work now lives in the archive at /work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all"
            style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
          >
            ← Back to Home
          </Link>

          <Link
            href="/work"
            className="px-8 py-4 border-2 border-[var(--grid)] hover:border-white transition-all"
            style={{ fontFamily: 'var(--font-body)', minHeight: '48px', minWidth: '120px' }}
          >
            View the Work
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
