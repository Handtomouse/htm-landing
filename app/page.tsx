import HandGameAnimation from '@/components/HandGameAnimation'
import EmailCaptureForm from '@/components/EmailCaptureForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Main content container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 md:gap-12">
        {/* Hand game animation */}
        <div className="w-full">
          <HandGameAnimation version="v2" />
        </div>

        {/* Coming soon text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-bb-orange font-vt323 tracking-wider">
            HANDTOMOUSE
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-vt323">
            LOADING...
          </p>
          <p className="text-base md:text-lg text-gray-400 font-vt323 max-w-2xl mx-auto">
            Independent creative direction and cultural strategy from Sydney.
            <br />
            Something special is being built. Get notified when we launch.
          </p>
        </div>

        {/* Email capture form */}
        <EmailCaptureForm />

        {/* Footer */}
        <footer className="mt-8 md:mt-16 text-center space-y-2">
          <p className="text-sm text-gray-600 font-vt323">
            © {new Date().getFullYear()} HandToMouse Studio
          </p>
          <div className="flex gap-4 justify-center text-gray-500 font-vt323">
            <a
              href="https://github.com/Handtomouse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bb-orange transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://instagram.com/handtomouse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bb-orange transition-colors"
            >
              INSTAGRAM
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
