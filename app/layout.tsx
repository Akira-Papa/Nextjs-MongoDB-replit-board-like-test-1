import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Japanese Greeting',
  description: 'A simple page displaying こんにちは',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  )
}
