import Sidebar from '@/components/Sidebar'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'),
{
  loading: () => <div className='p-2 m-2 text-xl'>A map is loading...</div>,
  ssr: false
})

export default function Home() {
  return (
    <section className='flex'>
      <Sidebar/>
      <Map zoom={10} />
    </section>
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
