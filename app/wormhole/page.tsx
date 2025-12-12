import WormholeContent from '@/components/WormholeContent'

export const metadata = {
  title: 'Wormhole | Hand To Mouse',
  description: 'Discover random corners of the web through the wormhole - a curated journey to unexpected destinations',
  alternates: {
    canonical: 'https://handtomouse.org/wormhole',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function WormholePage() {
  return <WormholeContent />
}
