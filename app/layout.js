import './globals.css'
import { Inter } from 'next/font/google'
import "tw-elements/dist/css/tw-elements.min.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dispatcher',
  description: 'Displaying flight plans from data.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
