import Maps from '@/components/Maps'
// import { useMemo } from 'react'
// import dynamic from 'next/dynamic'

export default function Home() {
  // const Map = useMemo(() => dynamic(
  //   () => import('@/components/Maps'),
  //   { 
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false
  //   }
  // ), [])

  return (
    <div style={{height: '100vh'}}>
      <Maps/>
    </div>
  )
}
