import './globals.css'
import { inter } from './fonts';
// import { Inter } from 'next/font/google'
// import { Roboto_Mono } from 'next/font/google'
import "tw-elements/dist/css/tw-elements.min.css";

// const inter = Inter({ subsets: ['latin'] })
// const roboto_mono = Roboto_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'Dispatcher',
  description: 'Displaying flight plans from data.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      {/* <body className={roboto_mono.className}>{children}</body> */}
    </html>
  )
}
