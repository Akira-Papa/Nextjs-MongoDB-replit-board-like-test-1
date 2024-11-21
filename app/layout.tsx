import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '掲示板 - Japanese Bulletin Board',
  description: '日本語の掲示板でコミュニケーションしましょう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white mb-8">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-3xl font-bold py-4">掲示板</h1>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
