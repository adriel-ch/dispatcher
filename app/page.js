import Map from '@/components/Map'
import Image from 'next/image'

export default function Home() {
  return (
    <Map/>
  )
}

// import { useMemo } from 'react'
// import dynamic from 'next/dynamic'

// insert into fn
  // const Map = useMemo(() => dynamic(
  //   () => import('@/components/Maps'),
  //   { 
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false
  //   }
  // ), [])
