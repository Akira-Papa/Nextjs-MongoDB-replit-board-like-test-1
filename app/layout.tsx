import './globals.css'
import type { Metadata } from 'next'
import ThemeRegistry from './components/ThemeRegistry'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum'

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
      <body>
        <ThemeRegistry>
          <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
            <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
              <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center' }}>
                <ForumIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 700 }}>
                  掲示板
                </Typography>
              </Container>
            </Toolbar>
          </AppBar>
          <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
              {children}
            </Box>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  )
}
