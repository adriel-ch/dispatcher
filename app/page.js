import dynamic from 'next/dynamic'

export default function Home() {
  const Map = dynamic(() => import('@/components/Map'),
  {
    loading: () => <p>A map is loading...</p>,
    ssr: false
  })
  return (
    <Map zoom={10} />
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
