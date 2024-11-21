import './globals.css'
import type { Metadata } from 'next'
import ThemeRegistry from './components/ThemeRegistry'
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Tooltip } from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

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
          <AppBar position="fixed" sx={{ mb: 4 }}>
            <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
              <Container maxWidth="md" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ForumIcon sx={{ mr: 2, fontSize: 32 }} />
                  <Typography variant="h1" sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem' }, 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #FFFFFF 30%, #E3F2FD 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    掲示板
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<TrendingUpIcon />}
                    sx={{ 
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    トレンド
                  </Button>
                  
                  <Tooltip title="通知">
                    <IconButton color="inherit" sx={{ ml: 1 }}>
                      <NotificationsIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="プロフィール">
                    <IconButton color="inherit" sx={{ ml: 1 }}>
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Container>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
              {children}
            </Box>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  )
}
