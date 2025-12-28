import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'You Should Have Known - Trivia',
  description: 'The ultimate country-based trivia challenge.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  )
}
