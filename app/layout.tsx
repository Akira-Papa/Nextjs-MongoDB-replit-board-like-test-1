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
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          body {
            font-family: 'Noto Sans JP', sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
