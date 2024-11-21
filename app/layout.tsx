import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppBar, Container, Typography } from '@mui/material'
import ThemeRegistry from './components/ThemeRegistry'

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
        <ThemeRegistry>
          <AppBar position="static" sx={{ mb: 4 }}>
            <Container>
              <Typography variant="h4" component="h1" sx={{ py: 2 }}>
                掲示板
              </Typography>
            </Container>
          </AppBar>
          <Container>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  )
}
